import React, { Component } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import update from 'immutability-helper'
import Lists from './Lists'
import Header from './Header'
import logo from './logo.png'
import reducer from './reducers'
import * as actions from './actions'

class OrgNotFoundError extends Error {}

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(
      thunkMiddleware
    )
  )
)

class App extends Component {
  componentDidMount () {
    const args = window.location.pathname.split('/').filter(e => e)
    this.orgName = args[0]

    const feedsPath = (args.length > 0 && `/${args.join('/')}`) || ''
    const path = `/feeds${feedsPath}`
    store.dispatch(actions.fetchEvents(path))
    this.observer = new IntersectionObserver(this.intersection)
  }

  intersection = (entries, observer) => {
    entries.forEach(entry => {
      if (this.state.collection.length > 0 && entry.isIntersecting) {
        this.setState({ loadingByFooter: true })

        console.log('------------')
        console.log('Calling next page')

        const path = `/feeds${this.feedsPath}?page=${this.state.page + 1}`
        fetch(path, { method: 'GET', credentials: 'same-origin' })
          .then(response => response.json())
          .then(collection => {
            const length = this.state.collection.length
            const lastId = this.state.collection[length - 1].id
            const offsetEvent = collection.find(e => e.id === lastId)
            const index = collection.indexOf(offsetEvent)

            let newCollection = null

            if (index === -1) {
              console.log('Pushing all events to collection')
              newCollection = update(this.state.collection, { $push: collection })
            } else {
              console.log('Pushing only events not loaded yet to collection')
              const newEvents = collection.slice(index + 1)
              newCollection = update(this.state.collection, { $push: newEvents })
            }

            this.setState({
              collection: newCollection,
              loadingByFooter: false,
              page: this.state.page + 1
            })
          })
      }
    })
  }

  fetchUser () {
    const options = { method: 'GET', credentials: 'same-origin' }
    fetch('/me', options)
      .then(response => response.json())
      .then(body => {
        if (body.error) { return }
        this.setState({ user: body })

        fetch('/feeds/user', options)
          .then(response => response.json())
          .then(body => {
            if (body.error) { return }
            this.setState({ userEvents: body })
          })
      })
  }

  updatePageTitle (update) {
    const user = this.state.user && this.state.user.login
    const title = `${user || this.orgName || ''} feeds at github`
    // const prefix = (update && `(${update}) `) || ''
    const prefix = ''
    document.title = `${prefix}${title}`
  }

  feedsLogo () {
    const org = this.state.collection[0] && this.state.collection[0].org
    if (this.orgName && org) {
      return org.avatar_url
    } else if (this.state.user) {
      return this.state.user.avatar_url
    }

    return logo
  }

  feedsName () {
    return (this.state.user && this.state.user.login)
      || this.orgName
      || 'Github Feeds'
  }

  render () {
    const state = store.getState()

    return (
      <Provider store={store}>
        <div className='helvetica w-80-ns w-100 mh3-ns'>
          <Header />
          <Lists />

          <footer ref={el => el && this.observer}
                  className='f7 fw1 mt2 ph2 mb2'>
            {this.loadingByFooter && <p>Loading older events ..</p>}
            <p>footer ..</p>
          </footer>
        </div>
      </Provider>
    )
  }
}

export default App

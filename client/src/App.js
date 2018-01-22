import React, { Component } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import update from 'immutability-helper'
import Lists from './Lists'
import Header from './Header'
import Footer from './Footer'
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
    const feedsPath = (args.length > 0 && `/${args.join('/')}`) || ''
    store.dispatch(actions.fetchSession(feedsPath))

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

  render () {
    return (
      <Provider store={store}>
        <div className='helvetica w-80-ns w-100 mh3-ns'>
          <Header />
          <Lists />
          <Footer />
        </div>
      </Provider>
    )
  }
}

export default App

import React, { Component } from 'react'
import update from 'immutability-helper'
import Events from './Events'
import ProjectsList from './ProjectsList'
import ErrorBanner from './ErrorBanner'
import logo from './logo.png'

const EventsList = ({ list }) => {
  if (list.length === 0) { return null }

  const events = list.map(events => <Events key={events.id} events={events} />)
  return <div>{events}</div>
}

class OrgNotFoundError extends Error {}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: null,
      userEvents: [],
      collection: [],
      error: null,
      page: 1,
      lastLoad: new Date()
    }

    const args = window.location.pathname.split('/').filter(e => e)
    this.feedsPath = (args.length > 0 && `/${args.join('/')}`) || ''
    this.orgName = args[0]
    this.fetchEvents()
    this.fetchUser()

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

  fetchEvents () {
    const path = `/feeds${this.feedsPath}`
    return fetch(path, { method: 'GET', credentials: 'same-origin' })
      .then(response => {
        if (response.ok && response.status === 200) {
          if (this.state.error) { this.setState({ error: null }) }
        }

        if (response.status === 404) {
          throw new OrgNotFoundError(`${this.feedsPath.substr(1)} not found`)
        }

        if (response.status === 500) {
          this.updatePageTitle(response.status)
        }

        return response.json()
      })
      .then(body => {
        if (body.error) {
          throw new Error(body.error)
        } else {
          this.updateEventsAndEnqueue(body)
        }
      })
      .catch(error => {
        if (error instanceof OrgNotFoundError) {
        } else {
          const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
          wait(60000).then(() => this.fetchEvents())
        }

        this.setState({ error: error.message, lastLoad: new Date() })
      })
  }

  updateEventsAndEnqueue (collection) {
    // FIXME TESTME
    if (this.state.collection.length > 0) {
      const ids = this.state.collection.map(e => e.id)
      const newEvents = collection.filter(e => ids.indexOf(e.id) === -1)

      if (newEvents.length > 0) {
        console.log('------------')
        console.log(`appending ${newEvents.length}`)

        const newCollection = update(this.state.collection, { $unshift: newEvents })

        this.setState({ collection: newCollection.slice(0, 100) })
        this.updatePageTitle(newEvents.length)
      }
    } else {
      this.setState({ collection: collection })
    }

    this.setState({ lastLoad: new Date() })
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
    wait(10000).then(() => this.fetchEvents())
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
    if (this.state.collection.length === 0 && !this.state.error) {
      return (
        <section className='mw7 pl3 helvetica'>
          <header className='relative mt2 mb2 ph2 h-100'>
            <span className='pa3'>Hang on ..</span>
          </header>
        </section>
      )
    }

    return (
      <div className='helvetica w-80-ns w-100 mh3-ns'>
        <header className='relative mv2 pb1 bb b--black-10 h-100'>
          <a href='/'
            className='link black'>
            <img src={this.feedsLogo()}
              title='github feeds'
              alt='github feeds'
              className='br3 h2 w2 dib pr3 pl3' />
            {this.feedsName()}
          </a>

          <span className='dbi f7 fw1 absolute mv2 mh2 bottom-0 right-0'>
            listing {this.state.collection.length} events
            <span className='di-ns dn'>
              , fetched at {this.state.lastLoad.toString()}
            </span>
          </span>
        </header>

        <div className='cf w-100'>
          <section className='fl w-70-ns w-100'>
            <ErrorBanner message={this.state.error} />
            <EventsList list={this.state.collection} />
          </section>

          <ProjectsList header="You've contributed to"
                        collection={this.state.userEvents} />
          <ProjectsList header='Featured projects'
                        collection={this.state.collection} />
        </div>

        <footer ref={el => el && this.observer.observe(el)}
                className='f7 fw1 mt2 ph2 mb2'>
          {this.state.loadingByFooter && <p>Loading older events ..</p>}
          <p>footer ..</p>
        </footer>
      </div>
    )
  }
}

export default App

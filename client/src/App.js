import React, { Component } from 'react'
import update from 'immutability-helper'
import Events from './Events'
import ErrorBanner from './ErrorBanner'
import githubLogo from './GitHub-Mark-120px-plus.png'

const EventsList = ({ list, newIds }) => {
  const events = list.map(events => {
    const justLoaded = newIds && newIds.indexOf(events.id) !== -1
    return <Events key={events.id} events={events} justLoaded={justLoaded} />
  })

  return <div>{events}</div>
}

class OrgNotFoundError extends Error {}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      collection: [],
      error: null,
      newIds: [],
      page: 1,
      lastLoad: new Date()
    }

    const args = window.location.pathname.split('/').filter(e => e)
    this.feedsPath = (args.length > 0 && `/${args.join('/')}`) || ''
    this.orgName = args[0]
    this.updatePageTitle()
    this.fetchEvents()

    this.observer = new IntersectionObserver(this.intersection)
  }

  intersection = (entries, observer) => {
    entries.forEach(entry => {
      if (this.state.collection.length > 0 && entry.isIntersecting) {
        this.setState({ loadingByFooter: true })

        console.log('------------')
        console.log('Calling next page')

        fetch(`/feeds${this.feedsPath}?page=${this.state.page + 1}`)
          .then(response => response.json())
          .then(collection => {
            const length = this.state.collection.length
            const lastId = this.state.collection[length - 1].id
            const offsetEvent = collection.find(e => e.id === lastId)
            const index = collection.indexOf(offsetEvent)

            console.log(lastId)
            console.log(offsetEvent)
            console.log(index)

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

  fetchEvents () {
    return fetch(`/feeds${this.feedsPath}`)
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
    if (this.state.collection.length > 0) {
      const firstId = this.state.collection[0].id
      const offsetEvent = collection.find(e => e.id === firstId)
      const newEvents = collection.slice(0, collection.indexOf(offsetEvent))

      if (newEvents.length > 0) {
        const newIds = newEvents.map(events => events.id)
        const newCollection = update(this.state.collection, { $unshift: newEvents })

        this.setState({
          newIds: newIds,
          collection: newCollection.slice(0, 100)
        })

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
    const title = `${this.orgName || 'user'} feeds at github`
    const prefix = (update && `(${update}) `) || ''
    document.title = `${prefix}${title}`
  }

  orgAvatar () {
    if (this.orgName && this.state.collection[0]) {
      return this.state.collection[0].org.avatar_url
    }

    return githubLogo
  }

  render () {
    console.log('------------')
    console.log(`rendering .. ${new Date()}`)
    return (
      <section className='mw7 pl3 helvetica'>
        <header className='relative mt2 mb2 ph2 h-100'>
          <a href='/'>
            <img src={this.orgAvatar()}
              title='github feeds'
              alt='github feeds'
              className='br3 h2 w2 dib pr3 pl3' />
          </a>
          <a href={`https://github.com/${this.orgName}`}
            className='link black'>
            {this.orgName}
          </a>

          <span className='dbi f7 fw1 absolute bottom-0 right-0'>
            listing {this.state.collection.length} events, fetched
            at {this.state.lastLoad.toString()}
          </span>
        </header>

        {this.state.error && <ErrorBanner message={this.state.error} />}
        {this.state.collection && <EventsList list={this.state.collection}
          newIds={this.state.newIds} />}

        <footer ref={el => el && this.observer.observe(el)} className='f7 fw1 mt2 ph2 mb2'>
          {this.state.loadingByFooter && <p>Loading older events ..</p>}
          <p>footer ..</p>
        </footer>
      </section>
    )
  }
}

export default App

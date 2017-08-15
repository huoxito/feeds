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

const OrgNotFoundError = message => {
  return { message: message, name: 'OrgNotFoundError' }
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = { collection: [], error: null, newIds: [] }

    this.orgName = window.location.pathname.substr(1).replace('/private', '')
    this.updatePageTitle()
    this.fetchEvents()
  }

  fetchEvents () {
    const orgName = window.location.pathname
    return fetch(`/feeds${orgName}`)
      .then(response => {
        if (response.ok && response.status === 200) {
          if (this.state.error) { this.setState({ error: null }) }
        }

        if (response.status === 404) {
          throw new OrgNotFoundError(`Org ${this.orgName} not found`)
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
      .catch(OrgNotFoundError, error => {
        this.setState({ error: error.message })
      })
      .catch(error => {
        const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
        wait(60000).then(() => this.fetchEvents())
        console.log('------------')
        console.log(`enqueued at ${new Date()} after error: ${error.message}`)

        this.setState({ error: error.message })
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

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
    wait(10000).then(() => this.fetchEvents())
    console.log('------------')
    console.log(`enqueued at ${new Date()}`)
  }

  updatePageTitle (update) {
    const title = `${this.orgName} feeds at github`
    const prefix = (update && `(${update})`) || ''
    document.title = `${prefix} ${title}`
  }

  orgAvatar () {
    if (this.orgName) {
      return this.state.collection[0] && this.state.collection[0].org.avatar_url
    }

    return githubLogo
  }

  render () {
    console.log('------------')
    console.log(`rendering .. ${new Date()}`)
    return (
      <section className='mw7 pl3 helvetica'>
        <h2 className='fw1 mt2 mb2 ph2'>
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
        </h2>

        {this.state.error && <ErrorBanner message={this.state.error} />}
        {this.state.collection && <EventsList list={this.state.collection}
          newIds={this.state.newIds} />}
      </section>
    )
  }
}

export default App

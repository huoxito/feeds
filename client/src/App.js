import React, { Component } from 'react'
import eventComponents from './Events'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = { events: [], error: null }
  }

  fetchEvents () {
    const orgName = window.location.pathname
    return fetch(`/feeds${orgName}`)
      .then((response) => {
        if (response.ok && response.status === 200) {
          return response.json()
        } else if (response.status === 404) {
          this.setState({ error: `Org ${orgName} not found`})
        } else {
          console.log(response)
          this.setState({ error: response })
        }
      })
      .then(body => {
        this.setState({ events: body })
        const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
        wait(10000).then(() => this.fetchEvents())
      })
  }

  componentDidMount () {
    this.fetchEvents()
  }

  resolveEvent (events) {
    const Event = eventComponents[events.type]
    return (
      <article key={events.id} className="bt pv3 ph2 bb b--black-10">
        {Event ? <Event events={events} /> : `Unhandled ${events.type}`}
      </article>
    )
  }

  render () {
    console.log(`listing ${this.state.events.length} events`)
    return (
      <section className='mw7 pl3 avenir'>
        <h2 className="baskerville fw1 ph3 ph0-l">Github Feeds</h2>

        {this.state.events &&
          this.state.events.map((events) => this.resolveEvent(events))}

        {this.state.error && <p className='red'>{this.state.error}</p>}
      </section>
    )
  }
}

export default App

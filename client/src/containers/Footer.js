import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchNextPage } from '../actions'

const mapStateToProps = (state) => {
  return {
    ...state
  }
}

class Footer extends Component {
  componentDidMount () {
    this.observer = new IntersectionObserver(this.fetchEvents)
  }

  fetchEvents = (entries, observer) => {
    this.props.dispatch(fetchNextPage(entries))
  }

  render () {
    if (this.props.starting || this.props.loading) { return null }

    return (
      <footer ref={el => el && this.observer.observe(el)}
              className='f7 fw1 mt2 ph2 mb2'>
        {this.props.loadingByFooter && <p>Loading older events ..</p>}
      </footer>
    )
  }
}

export default connect(mapStateToProps)(Footer)

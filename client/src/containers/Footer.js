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
    if (this.props.starting) { return null }

    return (
      <footer ref={el => el && this.observer.observe(el)}
              className='f7 fw1 mt2 ph2 mb2'>
        {this.loadingByFooter && <p>Loading older events ..</p>}
        <p>footer ..</p>
      </footer>
    )
  }
}

export default connect(mapStateToProps)(Footer)

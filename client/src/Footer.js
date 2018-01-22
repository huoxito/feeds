import * as React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
  return {
    ...state
  }
}

const Footer = (props) => {
  if (props.starting) { return null }
  return (
    <footer ref={el => el && this.observer}
            className='f7 fw1 mt2 ph2 mb2'>
      {this.loadingByFooter && <p>Loading older events ..</p>}
      <p>footer ..</p>
    </footer>
  )
}

export default connect(mapStateToProps)(Footer)

import * as React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
  return {
    ...state
  }
}

const Header = (props) =>
  <header className='relative mv2 pb1 bb b--black-10 h-100'>
    <a href='/'
      className='link black'>
      <img src={props.logo}
        title='github feeds'
        alt='github feeds'
        className='br3 h2 w2 dib pr3 pl3' />
      {props.feedsName}
    </a>

    <span className='dbi f7 fw1 absolute mv2 mh2 bottom-0 right-0'>
      listing {props.list.length} events
      <span className='di-ns dn'>
        , fetched at {props.lastLoad.toString()}
      </span>
    </span>
  </header>

export default connect(mapStateToProps)(Header)

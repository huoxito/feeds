import * as React from 'react'
import { connect } from 'react-redux'
import {
  Link
} from 'react-router-dom'

import appLogo from '../logo.png'

const mapStateToProps = ({ logo, path, pages, lastLoad }) => {
  return {
    logo,
    path,
    count: (pages[path] || []).length,
    lastLoad
  }
}

const Header = (props) =>
  <header className='relative mv2 pb1 bb b--black-10 h-100'>
    <Link to='/'
      className='link black'>
      <img src={appLogo}
        title='github feeds'
        alt='github feeds'
        className='br3 h2 w2 dib pr3 pl3' />
      {props.path}
    </Link>

    <span className='dbi f7 fw1 absolute mv2 mh2 bottom-0 right-0'>
      listing {props.count} events
      <span className='di-ns dn'>
        , fetched at {props.lastLoad.toString()}
      </span>
    </span>
  </header>

export default connect(mapStateToProps)(Header)

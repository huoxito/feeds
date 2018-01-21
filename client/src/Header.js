import * as React from 'react'

export default (props) => 
  <header className='relative mv2 pb1 bb b--black-10 h-100'>
    <a href='/'
      className='link black'>
      <img src={props.feedsLogo}
        title='github feeds'
        alt='github feeds'
        className='br3 h2 w2 dib pr3 pl3' />
      {props.feedsName}
    </a>

    <span className='dbi f7 fw1 absolute mv2 mh2 bottom-0 right-0'>
      listing {props.collection} events
      <span className='di-ns dn'>
        , fetched at {props.lastLoad}
      </span>
    </span>
  </header>

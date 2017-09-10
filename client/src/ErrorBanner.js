import React from 'react'

const ErrorBanner = ({ message }) =>
  <div className='dib pa2 red'>
    <span className='lh-title ml3'>{message}</span>
  </div>

export default ErrorBanner

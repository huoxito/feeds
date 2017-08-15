import React from 'react'

const ErrorBanner = ({ message }) =>
  <div className='flex items-center justify-center pa2 bg-washed-red navy'>
    <span className='lh-title ml3'>{message}</span>
  </div>

export default ErrorBanner

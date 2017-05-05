import React, { Component } from 'react'
import PageHOC from '../hocs/Page'

export default (WrappedComponent) => {
  const AuthLayout = props => (
    <div className='app'>
      <div className='app__content app__content_centered'>
        <img src='/static/img/logo.png' alt='Система' style={{ display: 'block', width: '41px', height: '36px', margin: '0 auto' }} />
        <br />
        <br />

        <WrappedComponent {...props} />
      </div>
    </div>
  )

  return PageHOC(AuthLayout)
}

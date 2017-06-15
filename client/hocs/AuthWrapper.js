import { connect } from 'react-redux'
import React, { Component } from 'react'
import { isEqual, isFunction } from 'lodash'

import ErrorLayout from '../layouts/error'

const mapStateToProps = selector => state => ({
  __auth: selector(state)
})

const AuthWrapper = (options = {}) => Next => {
  let { authSelector, predicate } = options

  class AuthWrapper extends Component {
    constructor (props) {
      super(props)

      let defaultValue = props.restricted || !predicate(props.__auth || {})

      this.state = {
        restricted: defaultValue
      }
    }

    async componentWillReceiveProps (nextProps) {
      if (!isEqual(nextProps.__auth, this.props.__auth)) await this.setState({ restricted: !predicate(nextProps.__auth) })
    }

    render () {
      let { restricted } = this.state
      if (restricted) return <ErrorLayout />

      return <Next {...this.props} />
    }
  }

  AuthWrapper.displayName = `AuthWrapper(${Next.displayName})`

  AuthWrapper.getInitialProps = async ctx => {
    let __auth = authSelector(ctx.store.getState())
    if (predicate(__auth)) return (Next.getInitialProps && isFunction(Next.getInitialProps)) ? Next.getInitialProps(ctx) : {}
    else return { restricted: true }
  }

  return connect(mapStateToProps(authSelector))(AuthWrapper)
}

export default AuthWrapper

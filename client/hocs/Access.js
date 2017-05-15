import { connect } from 'react-redux'
import React, { Component } from 'react'

import ErrorLayout from '../layouts/error'
import { restrictAccess, allowAccess } from '../redux/error'

export default rule => Next => {
  class AccessHoc extends Component {
    static async getInitialProps (ctx) {
      let state = ctx.store.getState()

      if (!rule(state.auth.user, state, ctx.params)) ctx.store.dispatch(restrictAccess('Ошабка прав доступа'))
      else ctx.store.dispatch(allowAccess())

      let initialProps = {}
      if (Next.getInitialProps) initialProps = await Next.getInitialProps(ctx)

      return initialProps
    }

    render () {
      let { access } = this.props

      if (access.error) {
        return <ErrorLayout code={access.error} message={access.message} />
      }

      return <Next {...this.props} />
    }
  }

  let mapStateToProps = state => ({
    access: state.error
  })

  return connect(mapStateToProps)(AccessHoc)
}

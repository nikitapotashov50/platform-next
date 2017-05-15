import React, { Component } from 'react'

import ErrorLayout from '../layouts/error'

export default rule => Next => {
  class AccessHoc extends Component {
    static async getInitialProps (ctx) {
      let state = ctx.store.getState()
      let access = rule(state.auth.user, state, ctx.params)

      let initialProps = {}
      if (Next.getInitialProps) initialProps = await Next.getInitialProps(ctx)

      return { accessResult: access, ...initialProps }
    }

    render () {
      let { accessResult } = this.props

      if (!accessResult) {
        return <ErrorLayout code={403} message={'Доступ запрещен'} />
      }

      return <Next {...this.props} />
    }
  }

  return AccessHoc
}

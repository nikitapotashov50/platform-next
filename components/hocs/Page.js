import React, { Component } from 'react'
import withRedux from 'next-redux-wrapper'
import Header from '../Header'
import { initStore, auth } from '../../redux/store'

export default (Page, mapStateToProps, mapDispatchToProps) => {
  return withRedux(
    initStore,
    mapStateToProps,
    mapDispatchToProps
  )(
    class DefaultPage extends Component {
      static async getInitialProps (ctx) {
        ctx.store.dispatch(auth())
        return Page.getInitialProps && Page.getInitialProps(ctx)
      }

      render () {
        return (
          <div>
            <Header />
            <Page {...this.props} />
          </div>
        )
      }
    }
  )
}

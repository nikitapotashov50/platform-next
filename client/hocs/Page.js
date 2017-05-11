import React, { Component } from 'react'
import withRedux from 'next-redux-wrapper'
import Head from 'next/head'
import { I18nextProvider } from 'react-i18next'

import starti18n, { getTranslations } from '../tools/start_i18n'
import initStore from '../redux/store'
import { auth } from '../redux/auth'

export default (Page, { title, mapStateToProps, mapDispatchToProps }) => {
  return withRedux(
    initStore,
    mapStateToProps,
    mapDispatchToProps
  )(
    class DefaultPage extends Component {
      static async getInitialProps (ctx) {
        if (ctx.req) {
          const { session } = ctx.req
          if (session.user) ctx.store.dispatch(auth(session.user))
        }

        let translations = await getTranslations('ru')

        let initialProps = {}
        if (Page.getInitialProps) initialProps = await Page.getInitialProps(ctx)

        return { translations, ...initialProps }
      }

      constructor (props) {
        super(props)
        this.i18n = starti18n(props.translations)
      }

      render () {
        return (
          <I18nextProvider i18n={this.i18n}>
            <div>
              <Head>
                <title>{title ? `${title} - БМ Платформа` : 'БМ Платформа'}</title>
                <meta charSet='utf-8' />
                <meta name='viewport' content='initial-scale=1.0, width=device-width' />
                <script src='https://cdn.polyfill.io/v2/polyfill.min.js' />
              </Head>
              <Page {...this.props} />

            </div>
          </I18nextProvider>
        )
      }
    }
  )
}

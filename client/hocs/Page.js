import axios from 'axios'
import moment from 'moment'
import numeral from 'numeral'
import { isFunction } from 'lodash'
import React, { Component } from 'react'
import withRedux from 'next-redux-wrapper'
import Head from 'next/head'
import { I18nextProvider } from 'react-i18next'

import Styles from './Styles'
import { auth, refresh, cookieExists } from '../redux/auth'
import { restrictAccess, allowAccess } from '../redux/error'
import { getActiveCount } from '../redux/tasks/index'

import initStore from '../redux/store'
import starti18n, { getTranslations } from '../tools/start_i18n'

import ErrorLayout from '../layouts/error'
import OverlayLoader from '../components/OverlayLoader'
import axiosDefaults from 'axios/lib/defaults'
axiosDefaults.baseURL = BACKEND_URL

moment.locale('ru')
numeral.language('ru', { delimiters: { thousands: ' ', decimal: '.' } })
numeral.language('ru')

export default (Page, { title, mapStateToProps, mapDispatchToProps, mergeProps, accessRule }) => {
  const realMapStateToProps = state => {
    let props = {}
    if (mapStateToProps && isFunction(mapStateToProps)) props = mapStateToProps(state)
    return {
      ...props,
      __service: {
        access: state.error,
        user: state.auth.user,
        hash: state.auth.cookieExists
      }
    }
  }

  const realMspDispatch = dispatch => {
    let disp = {}
    if (mapDispatchToProps && isFunction(mapDispatchToProps)) disp = mapDispatchToProps(dispatch)
    return { ...disp, __dispatch: dispatch }
  }

  return withRedux(
    initStore,
    realMapStateToProps,
    realMspDispatch,
    mergeProps
  )(
    class DefaultPage extends Component {
      static async getInitialProps (ctx) {
        ctx.store.dispatch(allowAccess())
        if (ctx.req && ctx.isServer) {
          if (ctx.req.session.uid) {
            ctx.store.dispatch(auth({ user: ctx.req.session.user, currentProgram: ctx.req.session.currentProgram, isRestored: ctx.req.session.isRestored }))
            await ctx.store.dispatch(refresh(ctx.req.session.uid))
            ctx.store.dispatch(getActiveCount({ headers: ctx.req.headers }))
          } else if (ctx.req.cookies.get('molodost_user')) ctx.store.dispatch(cookieExists())
        }

        if (accessRule && isFunction(accessRule)) {
          let state = ctx.store.getState()
          if (!accessRule(state.auth.user, state)) await ctx.store.dispatch(restrictAccess('Ошибка доступа'))
          else ctx.store.dispatch(allowAccess())
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

      async componentDidMount () {
        if (this.props.__service.hash && !this.props.__service.user) {
          let { data } = await axios.get(`/api/auth/restore`, { withCredentials: true })
          let dispatch = this.props.dispatch || this.props.__dispatch
          if (data.user && data.user._id) {
            dispatch(auth(data, true))
            await dispatch(refresh(data.user._id))
          } else dispatch(cookieExists(false))
        }
      }

      componentWillReceiveProps ({ __service, ...nextProps }) {
        if (accessRule && isFunction(accessRule)) {
          let flag = (__service.user && this.props.__service.user)
            ? (__service.user._id !== this.props.__service.user._id)
            : (__service.user !== this.props.__service.user)

          if (flag) {
            let dispatch = nextProps.dispatch || nextProps.__dispatch
            if (!accessRule(__service.user, nextProps)) dispatch(restrictAccess('Страница недоступна'))
            else dispatch(allowAccess())
          }
        }
      }

      render () {
        let { __service, ...props } = this.props

        let Body = null
        if (__service.hash && !__service.user) Body = <OverlayLoader full loading />
        else if (__service.access.error) Body = <ErrorLayout code={__service.access.error} message={__service.access.message} />

        let pageTitle = title ? `${title} - БМ Платформа` : 'БМ Платформа'
        if (__service.access.error) pageTitle = 'БМ Платформа'

        return (
          <I18nextProvider i18n={this.i18n}>
            <div>
              <Head>
                <title>{pageTitle}</title>
                <meta charSet='utf-8' />
                <meta name='viewport' content='initial-scale=1.0, width=device-width' />
                <link rel='icon' type='image/x-icon' href='/static/favicons/favicon.ico' />
                <link rel='apple-touch-icon' sizes='180x180' href='/static/favicons/apple-touch-icon.png' />
                <link rel='icon' type='image/png' href='/static/favicons/favicon-32x32.png' sizes='32x32' />
                <link rel='icon' type='image/png' href='/static/favicons/favicon-16x16.png' sizes='16x16' />
                <link rel='manifest' href='/static/favicons/manifest.json' />
                <link rel='stylesheet' type='text/css' href='/static/bundle.min.css' />
                <script src='https://cdn.polyfill.io/v2/polyfill.min.js' />
              </Head>

              { Body || <Page {...props} /> }

              <Styles />
            </div>
          </I18nextProvider>
        )
      }
    }
  )
}

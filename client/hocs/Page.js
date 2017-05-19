import axios from 'axios'
import moment from 'moment'
import numeral from 'numeral'
import { isFunction } from 'lodash'
import React, { Component } from 'react'
import withRedux from 'next-redux-wrapper'
import Head from 'next/head'
import { I18nextProvider } from 'react-i18next'

import { auth, cookieExists } from '../redux/auth'
import { fill as fillPrograms } from '../redux/user/programs'
import { restrictAccess, allowAccess } from '../redux/error'

import initStore from '../redux/store'
import starti18n, { getTranslations } from '../tools/start_i18n'

import ErrorLayout from '../layouts/error'
import OverlayLoader from '../components/OverlayLoader'

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

  return withRedux(
    initStore,
    realMapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(
    class DefaultPage extends Component {
      static async getInitialProps (ctx) {
        if (ctx.req && ctx.isServer) {
          if (ctx.req.session.user && ctx.req.session.user.id) {
            ctx.store.dispatch(auth(ctx.req.session))
            ctx.store.dispatch(fillPrograms(ctx.req.session.programs || []))
          } else if (ctx.req.cookies.get('molodost_user')) ctx.store.dispatch(cookieExists())
        }

        if (accessRule && isFunction(accessRule)) {
          let state = ctx.store.getState()
          if (!accessRule(state.auth.user, state)) ctx.store.dispatch(restrictAccess('Ошибка доступа'))
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

          if (data.user && data.user.id) {
            this.props.dispatch(auth(data, true))
            this.props.dispatch(fillPrograms(data.programs || []))
          }
        }
      }

      componentWillReceiveProps ({ __service, ...nextProps }) {
        let flag = (__service.user && this.props.__service.user)
          ? (__service.user.id !== this.props.__service.user.id)
          : (__service.user !== this.props.__service.user)

        if (flag && accessRule && isFunction(accessRule)) {
          if (!accessRule(__service.user, nextProps)) nextProps.dispatch(restrictAccess('Страница недоступна'))
          else nextProps.dispatch(allowAccess())
        }
      }

      render () {
        let { __service, ...props } = this.props

        let Body = null
        if (__service.hash && !__service.user) {
          Body = <OverlayLoader full loading />
        } else if (__service.access.error) {
          Body = <ErrorLayout code={__service.access.error} message={__service.access.message} />
        }

        return (
          <I18nextProvider i18n={this.i18n}>
            <div>
              <Head>
                <title>{title ? `${title} - БМ Платформа` : 'БМ Платформа'}</title>
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

              <style jsx global>{`
                             @reset-global pc;

                             @font-face {
                               font-family: 'museo_sans_cyrl';
                               src: url('/static/fonts/museosanscyrl_500-webfont.woff2') format('woff2'),
                                    url('/static/fonts/museosanscyrl_500-webfont.woff') format('woff'),
                                    url('/static/fonts/museosanscyrl_500-webfont.ttf') format('truetype'),
                                    url('/static/fonts/museosanscyrl_500-webfont.svg#museo_sans_cyrl500') format('svg');
                               font-weight: 500;
                               font-style: normal;

                             }

                             @font-face {
                                 font-family: 'museo_sans_cyrl';
                                 src: url('/static/fonts/museosanscyrl_700-webfont.woff2') format('woff2'),
                                      url('/static/fonts/museosanscyrl_700-webfont.woff') format('woff'),
                                      url('/static/fonts/museosanscyrl_700-webfont.ttf') format('truetype'),
                                      url('/static/fonts/museosanscyrl_700-webfont.svg#museo_sans_cyrl700') format('svg');
                                 font-weight: 700;
                                 font-style: normal;

                             }

                             @define-placeholder museo {
                               font-family: 'museo_sans_cyrl', Helvetica, Arial, sans-serif;
                             }

                             /* width */
                             $container-width: 875px;
                             $gap-width: 15px;

                             $transition-time: .3s;

                             html {
                               font-size: 14px;
                                -webkit-font-smoothing: antialiased;
                             }

                             body {
                               color: #1f1f1f;
                               background: #edeeee;
                               @extend museo;
                               -webkit-font-smoothing: antialiased;
                               -webkit-tap-highlight-color: rgba(255, 255, 255, 0);

                             }

                             img {
                               vertical-align: middle;
                             }

                             a {
                               color: #0c00ff;
                               text-decoration: none;
                             }

                             h1, h2, h3, h4, h5, h6 {
                               @extend museo;
                               color: #1f1f1f;
                               font-weight: 700;
                             }

                             textarea, input {
                               box-sizing: border-box;

                               width: 100%;
                               display: block;
                               padding: 7px 10px;
                               border: 1px solid #ebebeb;
                             }

                             input::-webkit-input-placeholder {color:#9f9f9f;},
                             input::-moz-placeholder {color:#9f9f9f;}
                             input:-moz-placeholder {color:#9f9f9f;}
                             input:-ms-input-placeholder {color:#9f9f9f;}
                             textarea::-webkit-input-placeholder {color:#9f9f9f;}
                             textarea::-moz-placeholder {color:#9f9f9f;}
                             textarea:-moz-placeholder {color:#9f9f9f;}
                             textarea:-ms-input-placeholder {color:#9f9f9f;}


                             button {
                               border: none;
                               outline: none;
                               background: none;
                             }

                             .pull-right {
                               text-align: right;
                             }

                             .noscroll {
                               overflow: hidden !important;
                             }

                             .app {
                               &__content {
                                 padding-top: 60px;

                                 margin: 0 auto;
                                 max-width: $container-width;

                                 &_centered { text-align: center; }
                               }
                             }

                             .feed {
                               padding-top: 10px;
                               margin-left: -7.5px;
                               margin-right: -7.5px;

                               &__left, &__right {
                                 box-sizing: border-box;
                                 padding: 0 7.5px;
                                 vertical-align: top;
                                 display: inline-block;
                               }

                               &__left { width: 66%; }
                               &__right {
                                 width: 33%;
                               }
                             }

                             .user-page {
                               &__header {
                                 border-radius: 0 0 3px 3px;

                                 margin-bottom: 30px;
                               }

                               &__content {
                                 margin: 0 -7.5px;
                                 display: block;
                               }

                               &__content-block {
                                 box-sizing: border-box;

                                 padding: 0 7.5px;
                                 vertical-align: top;
                                 display: inline-block;

                                 &_side {
                                   width: 300px;
                                 }
                                 &_body {
                                   width: calc(100% - 300px);
                                 }
                               }
                             }

                             .up-header {
                               position: relative;

                               width: 100%;
                               height: 198px;

                               background-color: #7a7a7a;
                               background-position: 0 0;
                               background-repeat: repeat;
                               background-size: cover;
                               background-image: url('/static/img/profile/default-bg.jpg');

                               &__image {
                                 border-radius: 3px;

                                 top: 52px;
                                 left: 71px;
                                 position: absolute;

                                 width: 158px;
                                 height: 158px;
                                 display: block;

                                 background: #000;
                                 border: 2px solid #fff;
                               }

                               &__buttons {
                                 right: 10px;
                                 bottom: 10px;
                                 position: absolute;
                               }

                               &__button {
                                 border-radius: 3px;
                                 transition: background $transition-time;

                                 margin: 0 0 0 5px;
                                 padding: 10px 15px;

                                 color: #fff;
                                 color: #fefefe;
                                 border: 0 none;
                                 font-size: 12px;
                                 font-weight: 700;
                                 text-transform: none;
                                 background-color: rgba(0,0,0,.4);

                                 cursor: pointer;

                                 &:hover, &_active { background-color: #196aff; }
                               }
                             }

                             .panel {
                               position: relative;
                               border-radius: 3px;

                               margin-bottom: 12px;

                               background: #fff;
                               border: 1px solid #e1e3e4;

                               &_margin {
                                 &_small { margin-bottom: 10px; }
                                 &_negative { margin-bottom: -2px; }
                               }
                               &_no_border { border-bottom: none; }
                               &_no_margin { margin-bottom: 0; }

                               &__title {
                                 margin-bottom: 0;
                                 line-height: 29px;

                                 color: #1f1f1f;
                                 font-size: 21px;
                                 font-weight: 700;
                               }

                               &__header {
                                 padding: 15px 20px;
                                 border-bottom: 1px solid #ebebeb;

                                 &_no-border { border-bottom: none }
                                 &_no-bottom-padding { padding-bottom: 0 }
                               }

                               &__sub-header {
                                 position: relative;

                                 margin: 0;
                                 padding: 12px 20px 7px;

                                 background: #f7f8f9;
                                 border-top: 1px solid #ebebeb;
                                 border-bottom: 1px solid #ebebeb;

                                 &_no {
                                   &_padding { padding: 0; }
                                 }
                               }

                               &__options {
                                 top: 10px;
                                 right: 0;
                                 position: absolute;

                                 height: 30px;
                                 width: 30px;
                               }

                               &__body {
                                 padding: 15px 20px;
                                 line-height: 150%;
                                 /*word-break: break-all;*/

                                 &_no {
                                   &_padding { padding: 0; }
                                   &_vertical-padding {
                                     padding-top: 0;
                                     padding-bottom: 0;
                                   }
                                   &_horizontal-padding {
                                     padding-left: 0;
                                     padding-right: 0;
                                   }
                                 }
                                 &_padding {
                                   &_small { padding: 15px; }
                                 }
                               }
                               &__footer {
                                 padding: 10px 15px;
                                 border-top: 1px solid #efeff0;
                               }
                               &__menu {
                                 border-bottom: 1px solid #e1e3e4;
                                 &_no_border { border-bottom: none; }
                               }
                             }

                             .task-sub-header {
                               &__title {
                                 line-height: 15px;

                                 color: #9f9f9f;
                                 font-size: 10px;
                                 font-weight: 700;
                                 letter-spacing: 1px;
                                 text-transform: uppercase;

                                 @extend museo;
                               }

                               &__link {
                                 margin: 0 0 5px;
                                 overflow: hidden;
                                 line-height: 19px;

                                 color: #333;
                                 font-size: 14px;
                                 font-weight: 700;

                                 &:hover { color: #333; }
                                 &:visited, &:active { color: #777; }
                               }
                             }

                             .panel-menu {
                               position: relative;
                               margin: 0 10px;

                               &__item {
                                 margin: 0 10px;
                                 vertical-align: top;
                                 display: inline-block;
                               }

                               &__link {
                                 box-sizing: border-box;

                                 display: block;
                                 padding-top: 2px;
                                 min-height: 50px;
                                 line-height: 46px;

                                 color: #2b2b2b;
                                 font-weight: 700;
                                 border-bottom: 2px solid transparent;

                                 &:hover, &:active, &_active { color: #0c00ff; }
                               }

                               &__item_bordered &__link {
                                 &:hover, &:active, &_active { border-bottom-color: #0c00ff; }
                               }
                             }

                             .panel-search {
                               top: 0;
                               right: 10px;
                               position: absolute;

                               width: 150px;
                               padding: 10px 0;

                               &_static {
                                 position: static;
                               }

                               &__input {
                                 transition: border .3s;

                                 border-radius: 3px;
                                 box-sizing: border-box;

                                 height: 30px;
                                 padding: 0 8px;
                                 line-height: 28px;

                                 font-size: 13px;
                                 background: #fefefe;
                                 border: 1px solid #cacaca;

                                 &:focus {
                                   border-color: #8a8a8a;
                                 }
                               }
                             }

                             .panel-form {
                               margin: 0 -20px;

                               &__row {
                                 margin-top: 10px;

                                 border-bottom: 1px solid #eee;

                                 &:last-of-type {
                                   border-bottom: none
                                 }
                               }
                               &__label {
                                 display: block;
                                 padding: 0 20px;
                                 height: 25px !important;
                                 line-height: 25px !important;

                                 color: #b5b5b5;
                                 font-size: 12px;
                                 text-transform: none;
                               }
                               &__input {
                                 appearance: none;

                                 height: 39px;
                                 display: block;
                                 line-height: 29px;
                                 padding: 0 20px 10px;

                                 border: none !important;
                                 outline: none !important;
                                 box-shadow: none !important;
                                 background: none;

                                 &:focus {
                                   border: none !important;
                                   outline: none !important;
                                   box-shadow: none !important;
                                 }

                                 &_textarea {
                                   resize: auto;
                                   height: auto;
                                 }
                               }
                               &__error {
                                 padding: 10px 20px;

                                 border-top: 1px solid #eee;
                               }
                               &__fake-input {
                                 padding: 0 20px 10px;
                               }
                               &__textarea {}
                             }

                             .user-inline {
                               position: relative;
                               display: block;

                               &_small { width: 40px; }
                               &_smallest { width: 30px; }

                               &__image-link {
                                 width: 50px;
                                 margin-right: 10px;
                                 vertical-align: top;
                                 display: inline-block;
                                 &_small { width: 40px; }
                                 &_smallest { width: 30px; }
                               }

                               &__image {
                                 border-radius: 50%;

                                 width: 50px;
                                 height: 50px;

                                 &_small {
                                   width: 40px;
                                   height: 40px;
                                 }
                                 &_smallest {
                                   width: 30px;
                                   height: 30px;
                                 }
                               }

                               &__body {
                                 max-width: 350px;
                                 vertical-align: top;
                                 display: inline-block;

                                 &_width {
                                   &_thin { max-width: 265px; }
                                 }
                               }

                               &__info {
                                 color: #7d7d7d;
                                 font-size: 12px;
                                 line-height: 15px;
                               }

                               &__title-block {
                                 margin-bottom: 6px;
                               }

                               &__title {
                                 margin-right: 10px;

                                 color: #1f1f1f;
                                 font-size: 14px;
                                 font-weight: 700;
                                 text-decoration: none;
                               }

                               &__when {
                                 color: #7d7d7d;
                                 font-size: 12px;
                               }

                               &__buttons {
                                 top: 0;
                                 right: 0;
                                 position: absolute;
                               }

                               &__money {
                                 top: 0;
                                 right: 0;
                                 position: absolute;

                                 margin-top: 2px;
                                 line-height: 18px;

                                 font-size: 12px;
                                 font-weight: 700;
                               }
                             }

                             .user-badge {
                               text-align: center;

                               &__name {
                                 margin-bottom: 7.5px;

                                 color: #1f1f1f;
                                 font-size: 21px;
                                 font-weight: 700;
                               }

                               &__info {
                                 font-size: 12px;
                                 line-height: 18px;
                                 color: #9f9f9f;
                               }
                             }

                             .myBtn {
                               box-sizing: border-box;

                               margin: 0 !important;
                               padding: 10px 20px;
                               display: inline-block;

                               color: #fff;
                               font-size: 15px;
                               background: #196aff;
                               text-transform: none;

                               border-radius: 3px;
                               cursor: pointer;

                               border: 1px solid #196aff;


                               & + & { margin-left: 5px !important; }

                               &_small {
                                 padding: 10px;
                                 font-size: 12px;
                               }

                               &_hollow {
                                 color: #0c00ff;
                                 border: 1px solid #0c00ff;
                                 background-color: transparent;

                                 &:disabled {
                                   opacity: .25;
                                   cursor: not-allowed;
                                 }

                                 &:hover, &:active, &:focus { background-color: transparent; }
                               }

                               &_thin {
                                 padding: 3.5px 20px;
                                 font-size: 10px;
                               }
                             }

                             .reply-form {
                               &__submit-block {
                                 margin: 15px 0;
                               }

                               &__input {
                                 box-sizing: border-box;
                                 border-radius: 3px 3px 3px 3px;

                                 height: 50px;
                                 display: block;
                                 padding: 0 15px;
                                 line-height: 50px;

                                 border: none !important;
                                 outline: none !important;
                                 box-shadow: none !important;

                                 &_text {
                                   &_big {
                                     font-size: 14px;
                                     font-weight: 700;
                                   }
                                   &_small {
                                     font-size: 13px;
                                   }
                                 }
                               }

                               &__textarea {
                                 resize: vertical;
                                 box-sizing: border-box;
                                 border-radius: 3px 3px 0 0;

                                 display: block;
                                 padding: 13px 10px 10px 15px;

                                 font-size: 13px;

                                 outline: none !important;
                                 box-shadow: none !important;
                                 border: solid #e1e3e4;
                                 border-width: 0 0 1px 0;

                                 &:focus, &:active {
                                   border-width: 0 0 1px 0;
                                   border-color: #e1e3e4;
                                 }

                                 &_short {
                                   border-radius: 3px 3px 3px 3px;
                                   resize: none;

                                   height: 50px;
                                   line-height: 50px;
                                   padding: 0 0 0 45px;

                                   border: none;
                                   background: svg("edit", "[fill]: #7f7f7f;") 16px 16px no-repeat #fff;
                                   background-size: 17px 17px;
                                 }
                               }
                             }

                             .post-preview {
                               &__title {
                                 line-height: 19px;
                                 margin-bottom: 5px;
                                 display: inline-block;

                                 color: #333;
                                 font-weight: 700;
                                 cursor: pointer;

                                 &:hover { color: #333; }
                                 &:visited, &:active { color: #777; }

                                 &:after {
                                   display: block;
                                   content: '';
                                 }
                               }

                               &__body {
                                 line-height: 20px;
                                 display: inline-block;

                                 color: #1f1f1f;
                                 &:hover { color: #1f1f1f; }
                               }
                             }

                             .post-summary {
                               box-sizing: border-box;
                               min-height: 25px;

                               &__block {
                                 &:after {
                                   clear: both;
                                   display: block;
                                   content: '';
                                 }
                                 &_left {
                                   float: left;
                                 }
                                 &_right {
                                   float: right;
                                 }
                               }

                               &__link {
                                 transition: color $transition-time;

                                 margin: 0 15px;
                                 line-height: 25px;
                                 vertical-align: top;
                                 display: inline-block;

                                 color: #8a8a8a;
                                 font-size: 13px;
                                 font-weight: 600;

                                 &:hover { color: #282828; }
                               }

                               &__info {
                                 line-height: 25px;
                                 vertical-align: top;
                                 display: inline-block;

                                 color: #9da5ab;
                                 font-size: 12px;
                                 font-weight: 500;

                                 & + & { margin-left: 15px; }

                                 &_icon {
                                   position: relative;

                                   padding-left: 25px;

                                   background: no-repeat;
                                   background-size: 18px 18px;
                                   background-position: center left;

                                   &_like { background-image: svg("like", "[fill]: #dadee1;"); }
                                   &_comment { background-image: svg("comment", "[fill]: #dadee1;"); }
                                 }

                                 &:before {
                                   content: attr(data-prefix);
                                 }
                               }
                             }

                             .rating-list {
                               &__item {
                                 padding-bottom: 10px;
                               }
                             }

                             .followers-list {
                               &__item {
                                 padding: 15px 20px;
                                 border-bottom: 1px solid #ebebeb;

                                 &:last-of-type { border-bottom: none; }
                               }
                             }

                             .panel-pager {
                               position: relative;
                               height: 19px;

                               &:after {
                                 clear: both;
                                 display: block;
                                 content: '';
                               }

                               &__btn {
                                 &_left { float: left; }
                                 &_right { float: right; }
                               }
                             }

                             .user-side-panel {
                               &__title {
                                 line-height: 14px;
                                 display: inline-block;
                                 color: #0c0c0c;
                                 font-size: 10px;
                                 font-weight: 700;
                                 letter-spacing: 2px;
                                 text-transform: uppercase;
                               }

                               &__body {}
                             }

                             .user-groups {
                               &__item {
                                 display: block;
                                 margin-top: 10px;
                               }
                               &__image {
                                 width: 30px;
                                 height: 30px;

                                 vertical-align: top;
                                 display: inline-block;
                               }
                               &__body {
                                 box-sizing: border-box;

                                 padding-left: 10px;
                                 vertical-align: top;
                                 display: inline-block;
                                 width: calc(100% - 30px);
                               }
                               &__link {
                                 box-sizing: border-box;

                                 padding: 5px 0;
                                 min-height: 30px;
                                 line-height: 20px;
                                 display: inline-block;

                                 font-size: 14px;
                                 font-weight: 700;

                                 &, &:focus, &:active, &:hover { color: #1f1f1f; }
                               }
                             }

                             .followers-tiles {
                               margin: 8px -2px 0;

                               &__item {
                                 aspect-ratio: '1:1';

                                 margin: 2px;
                                 vertical-align: top;
                                 display: inline-block;
                                 width: calc(33% - 4px);
                               }

                               &__image {
                                 width: 100%;
                                 height: 100%;

                                 background: no-repeat #f0f0f0;
                                 background-size: contain;

                                 &:after {
                                   bottom: 0;
                                   position: absolute;

                                   // width: 100%;
                                   display: block;
                                   line-height: 13px;
                                   padding: 15px 5px 4px;

                                   color: #fff;
                                   font-size: 11px;
                                   background: linear-gradient(180deg,rgba(2,1,1,0) 0,rgba(2,1,1,0) 3%,rgba(3,1,1,.81) 49%,rgba(5,1,1,.81));

                                   content: attr(data-name);
                                 }
                               }

                               &__item:hover &__image:after {
                                 background: linear-gradient(180deg,rgba(2,1,1,0) 0,rgba(3,4,9,0) 3%,rgba(13,52,126,.81) 49%,rgba(25,106,255,.81));
                               }
                             }

                             .profile-goal {
                               position: relative;
                               // box-shadow: inset 0 1px 0 0 rgba(0,0,0,.14);
                               border-top: #ebebeb;

                               &__progress {
                                 positin: absolute;

                                 height: 2px;
                                 display: block;
                                 background-color: rgb(35, 116, 255);

                                 &_completed {
                                   background-color: rgb(255, 116, 35);
                                 }
                               }

                               &__block {
                                 box-sizing: border-box;

                                 width: 50%;
                                 vertical-align: top;
                                 display: inline-block;
                                 padding: 10px 15px 15px;

                                 font-size: 14px;
                                 font-weight: 700;

                                 &:before {
                                   height: 20px;
                                   display: block;
                                   margin-top: 5px;
                                   line-height: 20px;

                                   color: #bbb;
                                   font-size: 10px;
                                   font-weight: 700;
                                   letter-spacing: 2px;
                                   text-transform: uppercase;

                                   content: '';
                                 }

                                 &_a {
                                   border-right: 1px solid #e1e3e4;

                                   &:before { content: 'Точка А'; }
                                 }
                                 &_b {
                                   &:before { content: 'Точка Б'; }
                                 }
                               }
                             }

                             .user-menu {
                               margin: 0;
                               padding: 0;
                               list-style: none;

                               &__partial {
                                 display: inline-block;
                               }

                               &__item {
                                 position: relative;
                                 cursor: pointer;

                                 margin: 0;
                                 height: 59px;
                                 line-height: 59px;
                                 padding: 0 13px;
                                 vertical-align: top;
                                 display: inline-block;

                                 border-left: 1px solid #f0f1f1;



                                 &_hoverable {
                                   transition: background .3s;
                                   &:hover { background-color: #f0f0f0; }
                                 }

                                 select {

                                   background: none;
                                   -webkit-appearance:none;
                                   border: 0 none;
                                   height: 59px;
                                   padding: 0 5px;
                                   width: 70px;

                                    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="32" height="24" viewBox="0 0 32 24"><polygon points="0,0 32,0 16,24" style="fill: rgb%28138, 138, 138%29"></polygon></svg>');
                                 background-size: 9px 6px;
                                 background-position: 100%;
                                 background-origin: content-box;
                                 background-repeat: no-repeat;

                                 }

                                 &_padded { padding: 9.5px 13px; }
                                 &_no {
                                   &_padding { padding: 0; }
                                 }
                               }

                               &__link {
                                 display: block;
                                 line-height: 59px;

                                 cursor: pointer;

                                 &, &:hover, &:active, &:visited {
                                   color: rgb(35, 116, 255);
                                   text-decoration: none;
                                 }

                                 &_icon {
                                   transition: color $transition-time;

                                   position: relative;
                                   box-sizing: border-box;

                                   height: 59px;
                                   min-width: 60px;
                                   padding-left: 45px;
                                   padding-right: 15px;

                                   &, &:hover, &:active, &:visited { color: #9da5ab; }

                                   &:before {
                                     top: 0;
                                     bottom: 0;
                                     left: 19px;
                                     position: absolute;

                                     width: 18px;
                                     height: 18px;
                                     margin: auto;

                                     background: no-repeat;
                                     background-size: contain;

                                     content: '';
                                   }

                                   &_search {
                                     &:before { background-image: svg("search", "[fill]: #dadee1;"); }
                                     &:hover:before { background-image: svg("search", "[fill]: #cdd2d5;"); }
                                   }
                                   &_like {
                                     &:before { background-image: svg("like", "[fill]: #dadee1;"); }
                                     &:hover:before { background-image: svg("like", "[fill]: #cdd2d5;"); }
                                   }
                                 }
                               }
                             }

                             .user-sub-menu {
                               right: 0;
                               top: 59px;
                               position: absolute;

                               list-style: none;
                               background: #fff;
                               border: 1px solid #e1e3e4;
                               box-shadow: 0 6px 6px 0 rgba(42, 51, 69, .16);

                               &__item {
                                 transition: background .3s;

                                 display: block;
                                 min-width: 200px;

                                 &:hover { background: #f0f0f0; }
                               }

                               &__link {
                                 display: block;
                                 line-height: 22px;
                                 padding: 8px 15px !important;

                                 &, &:hover, &:active { color: #1f1f1f; }
                               }
                             }

                             .app-header {
                               top: 0;
                               left: 0;
                               z-index: 100;
                               position: fixed;

                               width: 100%;
                               height: 59px;

                               background-color: #fefefe;
                               border-bottom: 1px solid #e1e3e4;

                               &__wrap {
                                 margin: 0 auto;
                                 width: $container-width;

                                 display: flex;
                                 justify-content: space-between;
                               }

                               &__block {
                                 display: block;
                               }
                             }

                             .menu {
                               margin: 0;
                               width: 100%;

                               list-style: none;

                               display: flex;
                               flex-wrap: nowrap;
                               align-items: center;

                               &__item {
                                 padding: 0 10px;

                                 &_no {
                                   &_padding-left { padding-left: 0; }
                                 }
                               }

                               &__link {
                                 margin: 0 !important;
                                 padding: 0 !important;
                                 height: 59px !important;
                                 line-height: 59px !important;

                                 display: block;
                                 color: #0c0c0c;
                                 font-size: 12px;
                                 font-weight: 700;
                                 letter-spacing: 1px;
                                 text-transform: uppercase;
                               }
                             }

                             .post-full {
                               box-sizing: border-box;

                               padding: 20px;
                               margin: 0 auto;
                               max-width: 800px;
                               /* max-width: 50rem; */

                               background: #fff;
                               border-bottom: 1px solid #e6e6e6;

                               &__header {}

                               &__header-info {
                                 color: #8a8a8a;
                                 font-size: 14px;
                                 line-height: 15px;

                                 &_link {
                                   color: #1f1f1f;
                                   font-weight: 700;
                                 }
                                 &_time {
                                   padding: 0 10px 0 37px;
                                   background: no-repeat;
                                   background-size: 15px 15px;
                                   background-position: 15px center;
                                   background-image: svg("clock", "[fill]: #1f1f1f;");
                                 }
                               }

                               &__comments {
                                 margin-top: 20px;
                                 border-top:
                               }

                               &__title {
                                 margin: 0 0 7.5px;

                                 font-size: 26px;
                                 font-weight: 700px;
                               }

                               &__footer {}

                               &__content {
                                 padding: 30px 0;
                                 line-height: 150%;
                               }
                             }

                             .comments {
                               box-sizing: border-box;
                               margin: 0 auto;
                               /* max-width: 50rem; */
                               max-width: 800px;
                               padding: 15px 32px 30px 20px;

                               background: #fff;

                               &__item {
                                 position: relative;

                                 margin: 10px 0;
                                 &_root { margin-bottom: 30px; }
                               }

                               &__branch { padding-left: 60px; }

                               &__branch-collapse {
                                 transform: rotate(180deg);
                                 transition: transform $transition-time;

                                 top: 0;
                                 right: -12px;
                                 z-index: 10;
                                 position: absolute;

                                 width: 12px;
                                 height: 12px;
                                 display: block;

                                 cursor: pointer;
                                 background: no-repeat;
                                 background-image: svg("chevron-down", "[fill]: #dadee1;");
                                 background-size: 12px 12px;

                                 &:hover { background-image: svg("chevron-down", "[fill]: #bbb;"); }

                                 &_collapsed {
                                   transform: rotate(0);
                                 }
                               }
                             }

                             .comment {
                               padding-left: 50px;
                               margin-bottom: 20px;

                               &:last-of-type { margin-bottom: 0; }

                               &__header { margin-left: -50px; }
                               &__body { margin-top: -19px; }
                               &__footer { margin-top: 5px; }

                               &__body {}

                             }

                             .share {
                               vertical-align: top;
                               display: inline-block;

                               &__label {
                                 line-height: 25px;
                                 vertical-align: top;
                                 display: inline-block;

                                 color: #9da5ab;
                                 font-size: 12px;
                               }

                               &__icon {
                                 width: 20px;
                                 height: 25px;
                                 margin-left: 10px;
                                 line-height: 25px;

                                 vertical-align: top;
                                 display: inline-block;

                                 background: no-repeat;
                                 background-position: center;

                                 &_vk {
                                   width: 30px;
                                   background-image: svg("vk", "[fill]: #bbb;");
                                 }
                                 &_facebook { background-image: svg("facebook", "[fill]: #bbb;"); }
                                 &_twitter { background-image: svg("twitter", "[fill]: #bbb;"); }
                               }
                             }

                             .modal {
                               &__overlay {
                                 top: 0;
                                 left: 0;
                                 z-index: 1000;
                                 position: fixed;

                                 width: 100%;
                                 height: 100%;

                                 background: rgba(0, 40, 100, .8);
                               }
                               &__content {
                                 border-radius: 3px;

                                 top: 0;
                                 left: 0;
                                 right: 0;
                                 position: absolute;

                                 padding: 16px;
                                 display: block;
                                 margin: 45px auto;

                                 background: #fff;
                               }
                               &__close {
                                 top: 16px;
                                 right: 18px;
                                 position: absolute;

                                 width: 12px;
                                 height: 12px;
                                 display: block;

                                 cursor: pointer;
                                 background: svg("close", "[fill]: #8a8a8a;") no-repeat;
                                 background-size: 12px 12px;

                                 &:hover { background-image: svg("close", "[fill]: color(#8a8a8a b(+5%));"); }
                               }
                             }

                             .post-modal {
                               top: 0;
                               left: 0;
                               z-index: 1000;
                               position: fixed;

                               width: 100%;
                               height: 100%;
                               display: block;
                               overflow-y: scroll;

                               background: rgba(0, 0, 0, .15);

                               &__content {
                                 border-radius: 3px;
                                 position: relative;

                                 width: 56rem;
                                 display: block;
                                 margin: 15px auto;
                                 padding: 35px 15px 0;

                                 background-color: #fefefe;

                                 &:focus {
                                   outline: none;
                                 }
                               }

                               &__top {
                                 top: 0;
                                 left: 0;
                                 position: fixed;

                                 width: 100%;
                                 height: 59px;
                                 display: block;
                                 margin: 0 auto;

                                 cursor: pointer;

                                 &:before {
                                   height: 100%;
                                   width: 62rem;
                                   margin: 0 auto;
                                   display: block;

                                   background: svg("close", "[fill]: #8a8a8a;") no-repeat;
                                   background-size: 12px 12px;
                                   background-position: 98% 50%;

                                   content: '';
                                 }

                                 &:hover&:before { background-image: svg("close", "[fill]: color(#8a8a8a b(+5%));"); }
                               }

                               &__control {
                                 top: 0;
                                 bottom: 0;
                                 position: fixed;

                                 width: 50px;
                                 height: 100%;
                                 display: block;
                                 margin: auto 0;
                                 max-height: 560px;

                                 color: #fff;
                                 // background: rgba(0, 0, 0, .55);

                                 &_left { left: 15px; }
                                 &_right { right: 15px; }
                               }
                             }


                             .login-form {
                               box-sizing: border-box;

                               padding: 20px;
                               max-width: 375px;

                               &__title {
                                 margin: 0 0 7.5px 0;

                                 font-size: 24px;
                                 text-align: left;
                               }
                               &__row {
                                 margin: 15px 0;

                                 &_double-margin { margin: 30px 0 15px; }
                                 &:last-of-type { margin-bottom: 0; }
                                 &_centered { text-align: center; }
                               }
                               &__label {
                                 padding: 0;
                                 display: block;
                                 margin: 0 0 6px;
                                 line-height: 16px;

                                 color: #b3b3b5;
                                 font-size: 12px;
                                 font-weight: 400;
                                 text-align: left;
                                 font-style: normal;
                               }
                               &__input {
                                 box-shadow: none;
                                 border-radius: 3px;
                                 box-sizing: border-box;

                                 width: 100%;
                                 height: 40px;
                                 display: block;
                                 padding: 0 10px;
                                 line-height: 40px;

                                 color: #232323;
                                 font-size: 16px;
                                 font-weight: 400;
                                 font-style: normal;
                                 background: #f8f9fc;
                                 border: 1px solid #dbe0e3;

                                 &::placeholder {
                                   font-size: 15px;
                                   color: #bbb;
                                 }
                               }

                               &__btn {
                                 border-radius: 3px;

                                 width: 100%;
                                 height: 40px;
                                 display: block;
                                 line-height: 20px;
                                 padding: 10px 20px;

                                 color: #fefefe;
                                 font-size: 15px;
                                 background: #196aff;
                                 text-transform: none;

                                 &:disabled {
                                   opacity: .25;
                                   cursor: not-allowed;
                                 }
                               }

                               &__link {
                                 color: #0c00ff;
                               }
                             }

                             .modal-fade-enter-active, .modal-fade-leave-active {
                               z-index: 1000;
                               position: relative;
                               transition: opacity .2s;
                             }
                             .modal-fade-enter, .modal-fade-leave-to, .modal-fade-leave-active {
                               opacity: 0;
                             }

                             .auth-container {
                               box-shadow: 2px 6px 6px 0 rgba(42, 51, 69, .16);

                               padding: 15px;
                               margin: 0 auto;
                               max-width: 875px;
                               display: inline-block;

                               background: #fff;
                             }

                             .footer {
                               height: 30px;
                             }

                             .error {
                               margin: 30px 0;
                               text-align: center;

                               &__title {
                                 margin: 15px auto;
                                 line-height: 120px;

                                 font-size: 120px;
                               }
                             }

                             .business-card {
                               width: 600px;
                               height: 333px;
                               margin: 0 auto;

                               background: #fff;
                               border: 1px solid #e1e3e4;
                               box-shadow: 0 6px 6px 0 rgba(42, 51, 69, .16);

                               &__block {
                                 height: 100%;
                                 vertical-align: top;
                                 display: inline-block;

                                 &_left { width: 215px; }
                                 &_right { width: calc(100% - 215px); }
                               }

                               &__image {
                                 margin: 15px;
                                 width: 185px;
                                 height: 185px;

                                 background: #000;
                               }
                             }


                             .nps-overall {
                               display: flex;
                               justify-content: space-between;

                               &__item {
                                 padding: 0 14px;
                                 text-align: center;
                               }

                               &__title {
                                 font-size: 14px;
                                 line-height: 14px;
                               }
                               &__value {
                                 font-size: 28px;
                                 line-height: 28px;
                               }
                             }

                             .rating-bar {
                               &_inline { display: inline-block; }
                             }

                             .nps-result {

                               &__row {
                                 position: relative;
                               }
                               &__row-title {
                                 font-size: 12px;
                                 line-height: 28px;
                               }
                               &__row-value {
                                 top: 0;
                                 right: 0;
                                 position: absolute;
                               }
                             }

                             .rating-star {
                               font-size: 21px;
                               line-height: 28px;

                               display: inline-block;
                             }

                             .pager {
                               margin-bottom: 15px;
                               text-align: center;

                               &__btn {
                                 transition: color $transition-time, border $transition-time, background $transition-time;
                                 box-sizing: border-box;

                                 height: 28px;
                                 margin: 0 3.5px;
                                 line-height: 14px;
                                 padding: 7px 14px;
                                 vertical-align: top;
                                 display: inline-block;

                                 color: #337ab7;
                                 background-color: #fff;
                                 border: 1px solid #ddd;

                                 &:hover, &_active {
                                   color: #23527c;
                                   background-color: #eee;
                                   border-color: #ddd;
                                 }

                                 &_control { margin: 0 14px; }
                               }
                               &__dots {
                                 height: 28px;
                                 margin: 0 14px;
                                 line-height: 28px;

                                 vertical-align: top;
                                 display: inline-block;
                               }
                             }

                             .fade_in {
                               animation-duration: 0.5s;
                               animation-name: fadeIn;
                             }

                           /*  Мобильные стили */
                           @media screen and (max-width: 39.9375em) {

                               .menu {
                                 padding: 0 0 0 10px;
                               }

                               .app-header {

                                 &__wrap {
                                   width: 100%;
                                 }
                               }

                               .feed {

                                 margin: 0;

                                 &__left {
                                   width: 100%;
                                   padding: 0;
                                 }

                                 &__right {
                                   display: none;
                                 }
                               }

                               .panel {
                                 border-radius: 0;
                               }


                               .user-sub-menu {

                               &__item {

                                 min-width: 250px;

                               }

                               &__link {

                                 padding: 16px 15px !important;
                                 font-size: 15px;
                               }
                             }

                               .comment {

                                 &__header .user-inline {


                                   &__when {
                                     display: none;
                                   }
                               }

                               }

                               .user-inline {

                                   &__title {
                                     display: block;
                                   }
                                   &__body {
                                     max-width: 215px;
                                   }

                               }


                               .post-modal {

                               &__content {
                                 padding:0;
                                 width: 100%;

                                 }

                              }

                              .post-full {

                               &__content {
                                 line-height: 150%;
                               }

                              }

                               .user-page {
                               &__header {

                               }

                               &__content {

                               }

                               &__content-block {


                                 &_side {
                                   width: 100%;
                                 }
                                 &_body {
                                   width: 100%;
                                 }
                               }
                             }


                             .reply-form {

                               &__input {
                                 border-radius: 0;
                                 font-size: 16px;
                               }

                               &__textarea {
                                 border-radius: 0;
                                 font-size: 16px;
                                 line-height: 140%;
                               }

                               &__textarea {


                                 &_short {
                                   border-radius: 0;
                                   font-size: 16px;
                                   padding: 13px 0 0 45px;


                                 }
                               }
                             }


                           }

                            @keyframes fadeIn {
                              from {
                                opacity: 0;
                              }
                              to {
                                opacity: 100%;
                              }
                            }
                           `}</style>
            </div>
          </I18nextProvider>
        )
      }
    }
  )
}

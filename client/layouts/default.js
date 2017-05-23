import Head from 'next/head'
import Router from 'next/router'
import NProgress from 'nprogress'
import Header from '../components/Header/index'

Router.onRouteChangeStart = () => NProgress.start()
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

const DefaultLayout = ({ children }) => (
  <div className='app'>
    <Head>
      <link rel='stylesheet' type='text/css' href='/static/postcss/nprogress.css' />
    </Head>
    <Header />

    <div className='app__content'>
      {children}
    </div>

    <div id='modal-portal' />
  </div>
)

export default DefaultLayout

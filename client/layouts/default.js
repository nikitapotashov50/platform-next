import Head from 'next/head'
import Router from 'next/router'
import NProgress from 'nprogress'
import Header from '../components/Header/index'
import ErrorContainer from '../components/Error/Container'

Router.onRouteChangeStart = () => NProgress.start()
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

const DefaultLayout = ({ children, menuItem = null }) => (
  <div className='app'>
    <Head>
      <link rel='stylesheet' type='text/css' href='/static/postcss/nprogress.css' />
    </Head>
    <Header selected={menuItem} />

    <div className='app__content'>
      {children}
    </div>

    <div id='modal-portal' />

    <ErrorContainer />
  </div>
)

export default DefaultLayout

import React, { Component } from 'react'

import config from '../config'
import FeedLayout from '../client/layouts/feed'
import Page from '../client/hocs/Page'
import PostEditor from '../client/components/PostEditor/index'
import PostList from '../client/components/Post/PostList'
import Panel from '../client/components/Panel'
import PanelMenu from '../client/components/PanelMenu'

const menuItems = [
  { href: '/', path: '/', title: 'Новое', code: 'index' },
  { href: '/?tab=subscriptions', path: '/feed/subscriptions', title: 'Мои подписки', code: 'subscriptions' }
]

class IndexPage extends Component {
  static async getInitialProps ({ store, req, query }) {
    let { auth, user } = store.getState()
    let params = {
      user: auth.user,
      programId: user.programs.current || null
    }

    if (query.tab === 'subscriptions' && auth.user) params.by_author_id = auth.subscriptions.join(',')

    await PostList.getInitial(store.dispatch, `http://${config.server.host}:${config.server.port}`, params)

    return { tab: query.tab || 'index' }
  }

  render () {
    let { tab, url, program } = this.props
    let params = {
      programId: program
    }

    if (tab === 'subscriptions') params.by_author_id = this.props.subscriptions.join(',')

    let pathname = {
      href: url.pathname + '?tab=' + tab,
      path: tab ? ('/feed/' + tab) : '/'
    }

    return (
      <FeedLayout>
        {this.props.user && <PostEditor />}

        <Panel noBody noMargin noBorder menuStyles={{ noBorder: true }} Menu={() => <PanelMenu items={menuItems} selected={tab} />} />

        <PostList params={params} pathname={pathname} />
      </FeedLayout>
    )
  }
}

export default Page(IndexPage, {
  title: 'Отчеты',
  mapStateToProps: ({ auth, user }) => ({
    user: auth.user,
    program: user.programs.current || null,
    subscriptions: auth.subscriptions
  })
})

import React, { Component } from 'react'

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

    let params = { programId: user.programs.current || null }

    if (req) params.user = req.session.user ? req.session.user.id : null

    if (query.tab === 'subscriptions' && auth.user) params.by_author_id = auth.subscriptions.join(',')

    await PostList.getInitial(store.dispatch, params, BACKEND_URL)

    return { tab: query.tab || 'index' }
  }

  render () {
    let { tab, url, program } = this.props

    let params = { programId: program }
    let pathname = { href: url.pathname + '?tab=' + tab, path: tab ? ('/feed/' + tab) : '/' }

    if (tab === 'subscriptions') params.by_author_id = this.props.subscriptions.join(',')

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
    program: user.programs.current,
    subscriptions: auth.subscriptions
  })
})

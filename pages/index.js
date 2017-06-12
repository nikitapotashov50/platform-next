import React, { Component } from 'react'

import FeedLayout from '../client/layouts/feed'
import Page from '../client/hocs/Page'
import PostEditor from '../client/components/PostEditor/index'
import PostList from '../client/components/Post/PostList'
import Panel from '../client/elements/Panel'
import PanelMenu from '../client/components/PanelMenu'
import TaskSide from '../client/elements/Tasks/SIde'

import { getTasks } from '../client/redux/tasks/index'

const menuItems = [
  { href: '/', path: '/', title: 'Актуальное', code: 'actual' },
  { href: '/?tab=new', path: '/feed/new', title: 'Новое', code: 'new' },
  { href: '/?tab=subscriptions', path: '/feed/subscriptions', title: 'Мои подписки', code: 'subscriptions' }
  // { href: '/?tab=groups', path: '/feed/groups', title: 'Моя десятка', code: 'groups' }
]

class IndexPage extends Component {
  static async getInitialProps ({ store, req, query }) {
    let { auth, user } = store.getState()
    const tab = query.tab || 'actual'

    let headers = null
    let params = { programId: user.programs.current || null, mode: tab }

    if (req) {
      params.user = req.session.user ? req.session.user._id : null
      headers = req.headers
    }

    if (tab === 'subscriptions' && auth.user) params.authorIds = (user.subscriptions || []).join(',')

    await Promise.all([
      PostList.getInitial(store.dispatch, params, { headers }),
      store.dispatch(getTasks(params.programId, 'active', { headers }))
    ])

    return { tab }
  }

  render () {
    let { tab, url, program, tasks } = this.props

    let params = { programId: program, mode: tab }
    let pathname = { href: url.pathname + '?tab=' + tab, path: tab ? ('/feed/' + tab) : '/' }

    if (tab === 'subscriptions') params.authorIds = this.props.subscriptions.join(',')

    return (
      <FeedLayout menuItem='index' Side={[ <TaskSide items={tasks} /> ]}>
        {this.props.user && <PostEditor />}

        <Panel noBody noMargin noBorder menuStyles={{ noBorder: true }} Menu={() => <PanelMenu items={menuItems} selected={tab} />} />

        <PostList params={params} pathname={pathname} />
      </FeedLayout>
    )
  }
}

export default Page(IndexPage, {
  title: 'Отчеты',
  mapStateToProps: ({ auth, user, tasks }) => ({
    user: auth.user,
    tasks: tasks.items.active || [],
    program: user.programs.current,
    subscriptions: user.subscriptions || []
  })
})

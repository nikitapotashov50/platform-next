import React, { Component } from 'react'
import NoSSR from 'react-no-ssr'
import { isEqual } from 'lodash'

import FeedLayout from '../client/layouts/feed'
import Page from '../client/hocs/Page'
import PostEditor from '../client/components/PostEditor/index'
import PostList from '../client/components/Post/PostList'
import Panel from '../client/elements/Panel'
import PanelMenu from '../client/components/PanelMenu'
import TaskSide from '../client/elements/Tasks/SIde'

import { tasksApiGet } from '../client/redux/tasks/index'

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
      headers = req.headers
      params.user = req.session.uid || null
    } else if (user && user._id) params.user = user._id

    if (tab === 'subscriptions' && auth.user) params.authorIds = (user.subscriptions || []).join(',')

    let requests = [ PostList.getInitial(store.dispatch, params, { headers }) ]
    if (user && user._id && params.programId) requests.push(store.dispatch(tasksApiGet(params.programId, 'active', { headers })))

    await Promise.all(requests)

    return { tab }
  }

  shouldComponentUpdate (nextProps) {
    let flag = !isEqual(nextProps.program, this.props.program) || !isEqual(nextProps.tasks, this.props.tasks) || !isEqual(nextProps.subscriptions, this.props.subscriptions) || !isEqual(nextProps.user, this.props.user)
    return flag
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.program !== this.props.program && nextProps.program) this.props.dispatch(tasksApiGet(nextProps.program, 'active', {}))
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

        <NoSSR onSSR={<div>Загрузка</div>}>
          <PostList params={params} pathname={pathname} />
        </NoSSR>
      </FeedLayout>
    )
  }
}

const mapStateToProps = ({ user, auth, tasks }) => ({
  user: auth.user,
  tasks: tasks.items.active || [],
  program: user.programs.current,
  subscriptions: user.subscriptions || []
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default Page(IndexPage, {
  title: 'Отчеты',
  mapStateToProps,
  mapDispatchToProps
})

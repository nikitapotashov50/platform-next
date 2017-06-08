import React, { Component } from 'react'
import { bindActionCreators } from 'redux'

import Panel from '../../client/elements/Panel'

import PanelMenu from '../../client/components/PanelMenu'
import PageHoc from '../../client/hocs/Page'
import FeedLayout from '../../client/layouts/feed'
import OverlayLoader from '../../client/components/OverlayLoader'

import TaskList from '../../client/components/Tasks/List/index'

import { getTasks, fetchEnd, fetchStart } from '../../client/redux/tasks/index'

const getLink = taskId => ({
  href: `/tasks/task?id=${taskId}`,
  path: `/tasks/${taskId}`
})

const filters = [
  { href: '/tasks', path: '/tasks', title: 'Текущие', code: 'current' },
  { href: '/tasks?type=pending', path: '/tasks?type=pending', title: 'На проверке', code: 'pending' },
  { href: '/tasks?type=approved', path: '/tasks?type=approved', title: 'Выполненые', code: 'approved' },
  { href: '/tasks?type=rejected', path: '/tasks?type=rejected', title: 'Отклоненные', code: 'rejected' }
]

class TasksIndex extends Component {
  async componentWillReceiveProps (nextProps) {
    if (this.props.program !== nextProps.program) await this.props.getTasks(nextProps.program, nextProps.type)
  }

  render () {
    let { tasks, type } = this.props
    let List = TaskList[type]

    return (
      <FeedLayout wide emptySide menuItem='tasks'>
        <Panel noBody noMargin noBorder Menu={() => <PanelMenu items={filters} selected={type} />} />

        <OverlayLoader loading={tasks.fetching}>
          <List tasks={tasks} getLink={getLink} />
        </OverlayLoader>
      </FeedLayout>
    )
  }
}

TasksIndex.getInitialProps = async ctx => {
  let { user } = ctx.store.getState()

  let headers = null

  let type = ctx.query.type || 'current'

  if (ctx.req) headers = ctx.req.headers
  await ctx.store.dispatch(getTasks(user.programs.current, type, { headers }))

  return { type: ctx.query.type || 'current' }
}

const mapStateToProps = ({ tasks, user }) => ({
  tasks: tasks.items,
  program: user.programs.current
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getTasks,
  fetchEnd,
  fetchStart
}, dispatch)

const mergeProps = (state, dispatch, props) => ({
  ...state,
  ...props,
  getTasks: async (programId, type) => {
    dispatch.fetchStart()
    await dispatch.getTasks(programId, type)
    dispatch.fetchEnd()
  }
})

export default PageHoc(TasksIndex, {
  title: 'Задания',
  accessRule: user => !!user,
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
})

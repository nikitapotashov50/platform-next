import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import isLogged from '../../client/components/Access/isLogged'

import Panel from '../../client/elements/Panel'

import PanelMenu from '../../client/components/PanelMenu'
import PageHoc from '../../client/hocs/Page'
import FeedLayout from '../../client/layouts/feed'
import ErrorLayout from '../../client/layouts/error'
import OverlayLoader from '../../client/components/OverlayLoader'

import TaskList from '../../client/components/Tasks/List/index'

import { tasksApiGet } from '../../client/redux/tasks/index'

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
  constructor (props) {
    super(props)

    this.state = {
      restrict: props.notFound || false
    }
  }

  async componentWillReceiveProps (nextProps, nextState) {
    if (this.props.program !== nextProps.program) {
      if (nextProps.program !== 3) {
        if (this.state.restrict) await this.setState({ restrict: false })
        await this.props.tasksApiGet(nextProps.program, nextProps.type)
      } else await this.setState({ restrict: true })
    }
  }

  render () {
    if (this.state.restrict) return <ErrorLayout />

    let { tasks, type } = this.props
    let List = TaskList[type]

    return (
      <FeedLayout wide emptySide menuItem='tasks'>
        <Panel noBody noMargin noBorder Menu={() => <PanelMenu items={filters} selected={type} />} />

        <OverlayLoader loading={tasks.fetching}>
          { List && (<List tasks={tasks} getLink={getLink} />)}
        </OverlayLoader>
      </FeedLayout>
    )
  }
}

TasksIndex.getInitialProps = async ctx => {
  let { user } = ctx.store.getState()
  let type = ctx.query.type || 'current'

  if (user.programs.current === 3) return { notFound: true, type }

  let headers = null

  if (ctx.req) headers = ctx.req.headers
  await ctx.store.dispatch(tasksApiGet(user.programs.current, type, { headers }))

  return { type }
}

const mapStateToProps = ({ tasks, user }) => ({
  tasks: tasks.items,
  program: user.programs.current
})

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    tasksApiGet
  }, dispatch),
  dispatch
})

const mergeProps = (state, dispatch, props) => ({
  ...state,
  ...props,
  tasksApiGet: dispatch.tasksApiGet,
  dispatch: dispatch.dispatch
})

export default PageHoc(isLogged(TasksIndex), {
  title: 'Задания',
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
})

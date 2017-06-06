import { bindActionCreators } from 'redux'

import Panel from '../../client/elements/Panel'
import PanelMenu from '../../client/components/PanelMenu'
import PageHoc from '../../client/hocs/Page'
import FeedLayout from '../../client/layouts/feed'

import TaskList from '../../client/components/Tasks/List/index'

import { getTasks } from '../../client/redux/tasks/index'

const getLink = taskId => ({
  href: `/tasks/task?id=${taskId}`,
  path: `/tasks/${taskId}`
})

const filters = [
  { href: '/tasks', path: '/tasks', title: 'Текущие', code: 'current' },
  { href: '/tasks?type=approved', path: '/tasks?type=approved', title: 'Выполненые', code: 'approved' },
  { href: '/tasks?type=rejected', path: '/tasks?type=rejected', title: 'Отклоненные', code: 'rejected' },
  { href: '/tasks?type=pending', path: '/tasks?type=pending', title: 'На проверке', code: 'pending' }
]

const TasksIndex = ({ tasks, type }) => {
  let List = TaskList[type]
  return (
    <FeedLayout wide emptySide menuItem='tasks'>
      <Panel noBody noMargin noBorder Menu={() => <PanelMenu items={filters} selected={type} />} />

      <List tasks={tasks} getLink={getLink} />
    </FeedLayout>
  )
}

TasksIndex.getInitialProps = async ctx => {
  let { user } = ctx.store.getState()

  let headers = null
  let type = ctx.query.type || 'current'

  if (ctx.req) headers = ctx.req.headers
  await ctx.store.dispatch(getTasks(user.programs.current, type, { headers }))

  return { type: ctx.query.type || 'current' }
}

const mapStateToProps = ({ tasks }) => ({
  tasks: tasks.items
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getTasks
}, dispatch)

export default PageHoc(TasksIndex, {
  title: 'Задания',
  accessRule: user => !!user,
  mapStateToProps,
  mapDispatchToProps
})

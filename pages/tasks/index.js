import { bindActionCreators } from 'redux'

import Panel from '../../client/elements/Panel'
<<<<<<< HEAD
import PanelMenu from '../../client/components/PanelMenu'
import PageHoc from '../../client/hocs/Page'
import FeedLayout from '../../client/layouts/feed'

import TaskList from '../../client/components/Tasks/List/index'
=======
import PageHoc from '../../client/hocs/Page'
import FeedLayout from '../../client/layouts/feed'

import TaskPreview from '../../client/components/Tasks/Preview'
>>>>>>> 4be3b2a01a129e6a936ce5befb5943ae3fb39761

import { getTasks } from '../../client/redux/tasks/index'

const getLink = taskId => ({
  href: `/tasks/task?id=${taskId}`,
  path: `/tasks/${taskId}`
})

<<<<<<< HEAD
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
=======
const TasksIndex = ({ tasks }) => {
  return (
    <FeedLayout wide emptySide menuItem='tasks'>
      { (tasks.knife.length > 0) && tasks.knife.map(el => (
        <TaskPreview key={el._id} link={getLink(el._id)} task={el} />
      ))}

      { (tasks.active.length > 0) && (<div className='tasks-inline-header'>Активные задания</div>) }

      { (tasks.active.length > 0) && tasks.active.map(el => (
        <TaskPreview key={el._id} link={getLink(el._id)} task={el} />
      ))}
      { (!tasks.active.length) && (
        <Panel>
          <div className='text-center'>У вас нет активных заданий.</div>
        </Panel>
      )}

      <div className='tasks-inline-header'>Выполнено</div>

      { (tasks.replied.length > 0) && tasks.replied.map(el => (
        <TaskPreview key={el._id} link={getLink(el._id)} task={el} completed status='pending' statusText='На проверке' />
      ))}

      <style jsx>{`
        .tasks-inline-header {
          margin: 20px 0;

          font-size: 11px;
          font-weight: 600;
          text-align: center;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: color(#ebebeb b(+50%));
        }
      `}</style>
>>>>>>> 4be3b2a01a129e6a936ce5befb5943ae3fb39761
    </FeedLayout>
  )
}

TasksIndex.getInitialProps = async ctx => {
  let { user } = ctx.store.getState()

  let headers = null
<<<<<<< HEAD
  let type = ctx.query.type || 'current'

  if (ctx.req) headers = ctx.req.headers
  await ctx.store.dispatch(getTasks(user.programs.current, type, { headers }))

  return { type: ctx.query.type || 'current' }
=======
  if (ctx.req) headers = ctx.req.headers
  let res = await ctx.store.dispatch(getTasks(user.programs.current, { headers }))
  console.log(res)
  return {}
>>>>>>> 4be3b2a01a129e6a936ce5befb5943ae3fb39761
}

const mapStateToProps = ({ tasks }) => ({
  tasks: tasks.items
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getTasks
}, dispatch)

export default PageHoc(TasksIndex, {
  title: 'Задания',
<<<<<<< HEAD
  accessRule: user => !!user,
=======
  accessRule: () => true,
>>>>>>> 4be3b2a01a129e6a936ce5befb5943ae3fb39761
  mapStateToProps,
  mapDispatchToProps
})

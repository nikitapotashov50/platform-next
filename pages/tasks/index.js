import { bindActionCreators } from 'redux'

import Panel from '../../client/elements/Panel'
import PageHoc from '../../client/hocs/Page'
import FeedLayout from '../../client/layouts/feed'

import TaskPreview from '../../client/components/Tasks/Preview'

import { getTasks } from '../../client/redux/tasks/index'

const getLink = taskId => ({
  href: `/tasks/task?id=${taskId}`,
  path: `/tasks/${taskId}`
})

const TasksIndex = ({ tasks }) => {
  return (
    <FeedLayout wide emptySide>
      { (tasks.knife.length > 0) && tasks.knife.map(el => (
        <TaskPreview key={el._id} link={getLink(el._id)} task={el} />
      ))}

      { (tasks.active.length > 0) && (<div className='tasks-inline-header'>Активные задания</div>) }

      { (tasks.active.length > 0) && tasks.active.map(el => (
        <TaskPreview key={el._id} link={getLink(el._id)} task={el} />
      ))}
      { (!tasks.active.length) && (
        <Panel>
          <div className='text-center'>У вас нет активных заданий, отдыхайте.</div>
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
    </FeedLayout>
  )
}

TasksIndex.getInitialProps = async ctx => {
  let { user } = ctx.store.getState()

  let headers = null
  if (ctx.req) headers = ctx.req.headers
  await ctx.store.dispatch(getTasks(user.programs.current, { headers }))
  return {}
}

const mapStateToProps = ({ tasks }) => ({
  tasks: tasks.items
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getTasks
}, dispatch)

export default PageHoc(TasksIndex, {
  title: 'Задания',
  accessRule: () => true,
  mapStateToProps,
  mapDispatchToProps
})

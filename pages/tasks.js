import moment from 'moment'
import { bindActionCreators } from 'redux'

import PageHoc from '../client/hocs/Page'
import Panel from '../client/components/Panel'
import FeedLayout from '../client/layouts/feed'

import { getTasks } from '../client/redux/tasks/index'

const TasksIndex = ({ tasks }) => {
  return (
    <FeedLayout wide emptySide>
      { (tasks.items.length > 0) && tasks.items.map(el => (
        <Panel bodyStyles={{ paddingClass: 'smallest' }} key={el._id}>
          <div className='task-preview'>
            <div className='task-preview__block task-preview__block_title'>
              <div className='task-preview__title'>{el.title}</div>
              <div className='task-preview__description'>{el.content}</div>
            </div>
            <div className='task-preview__block task-preview__block_status'>
              осталось
              <br />
              {moment().to(moment(el.finish_at), true)}
            </div>
            <div className='task-preview__block task-preview__block_status'>

              <button className='task-preview__button'>Выполнить</button>

            </div>
          </div>
        </Panel>
      ))}

      <div className='tasks-inline-header'>Выполнено</div>

      {/* { (tasks.length > 0) && tasks.map(el => (
        <Panel bodyStyles={{ noPadding: true }} key={el.id}>
          {el.title}
        </Panel>
      ))} */}

      <style jsx>{`
        .task-preview {
          display: flex;
        }
        .task-preview__block {
          vertical-align: top;
          display: inline-block;
        }
        .task-preview__block_title {
          width: 60%;
        }
        .task-preview__block_status {
          width: 20%;
          text-align: center;
          border-left: 1px solid #ebebeb;
        }

        .task-preview__title {
          line-height: 26px;

          font-size: 22px;
          font-weight: bold;
        }
        .task-preview__description {
          font-size: 14px;
          font-weight: 400;
        }

        .task-preview__button {
          color: #196aff;
        }

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
  await ctx.store.dispatch(getTasks(user.programs.current))
  return {}
}

const mapStateToProps = ({ tasks }) => ({ tasks })

const mapDispatchToProps = dispatch => bindActionCreators({
  getTasks
}, dispatch)

export default PageHoc(TasksIndex, {
  title: 'Задания',
  accessRule: () => true,
  mapStateToProps,
  mapDispatchToProps
})

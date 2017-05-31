import { isUndefined } from 'lodash'

import PageHoc from '../../client/hocs/Page'
import FeedLayout from '../../client/layouts/feed'

import TaskContent from '../../client/components/Tasks/Content'
import TaskReply from '../../client/components/Tasks/ReplyForm'
import ReplyContent from '../../client/components/Tasks/ReplyContent'

import { getTask } from '../../client/redux/task/task'
import { getReply } from '../../client/redux/task/reply'

const TaskPage = ({ task, replyOpened, reply, specific = null, replyStatus, isReplied }) => (
  <FeedLayout wide emptySide>
    <TaskContent task={task} />

    { (!isReplied || !reply) && <TaskReply task={task} opened={replyOpened} /> }

    { (reply && replyStatus) && (
      <div className='task-inline-status' data-prefix='Статус проверки'>
        <div className='task-inline-status__title'>{replyStatus.title}</div>
      </div>
    ) }

    { reply && <ReplyContent type={task.replyType} reply={reply} specific={specific} /> }

    <style jsx>{`
      .task-inline-status {
        margin: 10px 0;
        padding: 10px 0;

        text-align: center;
      }
      .task-inline-status:before {
        display: block;

        color: #999;
        font-size: 12px;
        content: attr(data-prefix);
      }
      .task-inline-status__title {
        font-size: 14px;
        line-height: 20px;
      }
    `}</style>
  </FeedLayout>
)

TaskPage.getInitialProps = async ctx => {
  let headers = null
  if (ctx.req) headers = ctx.req.headers

  await ctx.store.dispatch(getTask(ctx.query.id, { headers }))
  let { payload } = await ctx.store.dispatch(getReply(ctx.query.id, { headers }))

  return {
    isReplied: !!payload.reply,
    replyOpened: !isUndefined(ctx.query.reply)
  }
}

const mapStateToProps = ({ task }) => ({
  task: task.info,
  reply: task.reply.info,
  specific: task.reply.specific,
  replyStatus: task.reply.info ? task.reply.status : null
})

export default PageHoc(TaskPage, {
  title: 'Задание',
  mapStateToProps
})

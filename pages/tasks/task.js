import moment from 'moment'
import { isUndefined } from 'lodash'
import Router from 'next/router'
import React, { Component } from 'react'

import isLogged from '../../client/components/Access/isLogged'

import PageHoc from '../../client/hocs/Page'
import FeedLayout from '../../client/layouts/feed'
import ErrorLayout from '../../client/layouts/error'
import Button from '../../client/elements/Button'

import TaskContent from '../../client/components/Tasks/Content'
import TaskReply from '../../client/components/Tasks/ReplyForm'
import ReplyContent from '../../client/components/Tasks/ReplyContent'

import { getTask } from '../../client/redux/task/task'
import { getReply } from '../../client/redux/task/reply'

const checkDate = (date, target = null) => (moment(date) > moment())

const getInitial = async (taskId, dispatch, headers = null) => {
  return Promise.all([
    dispatch(getTask(taskId, { headers })),
    dispatch(getReply(taskId, { headers }))
  ])
}

class TaskPage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      restrict: props.notFound || false
    }
  }

  async componentWillReceiveProps (nextProps, nextState) {
    if (this.props.program !== nextProps.program) {
      try {
        await getInitial(nextProps.taskId, this.props.dispatch)
        this.setState({ restrict: false })
      } catch (e) {
        this.setState({ restrict: true })
      }
    }
  }

  toggleEdit (flag, e) {
    e.preventDefault()
    let route = Router.router

    Router.push(
      { pathname: route.pathname, query: { ...route.query, ...(flag ? { edit: true } : {}) } },
      { pathname: `/tasks/${this.props.taskId}`, query: flag ? { edit: true } : {} },
      { shallow: true }
    )
  }

  render () {
    if (this.state.restrict || !this.props.task) return <ErrorLayout />

    let { edit } = this.props.url.query
    let { task, post, reply, specific = null, replyStatus, isReplied } = this.props

    let canEdit = checkDate(task.finish_at) && reply

    // нельзя редактировать, если отчет уже проверен
    if (canEdit && replyStatus && reply.replyTypeId === 4 && replyStatus._id === 3) canEdit = false
    edit = canEdit && !isUndefined(edit)

    return (
      <FeedLayout wide emptySide menuItem='tasks'>
        <TaskContent task={task} />

        { (reply && replyStatus) && (
          <div className='task-inline-status'>
            <div className='task-inline-status__title'>Задание {replyStatus.title.toLowerCase()}</div>
          </div>
        ) }

        { (!isReplied || !reply || edit) && <TaskReply task={task} reply={reply} attachments={post ? post.attachments : []} opened edit={edit} cancelEdit={this.toggleEdit.bind(this, false)} /> }

        { (reply && !edit) && <ReplyContent type={task.replyType} post={post} reply={reply} specific={specific} /> }
        { (canEdit && !edit) && (
          <div>
            <Button onClick={this.toggleEdit.bind(this, true)}>Редактировать ответ</Button>
            <br /><br />
            <div>Вы можете отредактировать свой ответ до тех пор, пока он не прошер проверку или время на выполнение задания еще не вышло</div>
          </div>
        )}

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
  }
}

TaskPage.getInitialProps = async ctx => {
  let headers = null
  let taskId = ctx.query.id
  if (ctx.req) headers = ctx.req.headers

  try {
    await getInitial(taskId, ctx.store.dispatch, headers)

    return { taskId }
  } catch (e) {
    return { notFound: true, taskId }
  }
}

const mapStateToProps = ({ task, user }) => ({
  program: user.programs.current || null,
  task: task.info,
  post: task.reply.post,
  reply: task.reply.info,
  isReplied: !!task.reply.info,
  specific: task.reply.specific,
  replyStatus: task.reply.info ? task.reply.status : null
})

const mapDispatchToProps = dispatch => ({ dispatch })

export default PageHoc(isLogged(TaskPage), {
  title: 'Задание',
  mapStateToProps,
  mapDispatchToProps
})

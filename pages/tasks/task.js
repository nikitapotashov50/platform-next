import React, { Component } from 'react'
import { isUndefined } from 'lodash'

import Button from '../../client/elements/Button'
import Panel from '../../client/components/Panel'

import PageHoc from '../../client/hocs/Page'
import FeedLayout from '../../client/layouts/feed'
import TextWithImages from '../../client/components/Post/TextWithImages'
import OverlayLoader from '../../client/components/OverlayLoader'

// replies
import GoalReply from '../../client/components/Tasks/Reply/goal'

import { getTask } from '../../client/redux/task/task'
import { getReply, postReply } from '../../client/redux/task/reply'

class TaskPage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      replyForm: false,
      reply: {
        content: ''
      },
      success: false,
      fetching: false
    }

    this.submit = this.submit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.toggldeReplyForm = this.toggldeReplyForm.bind(this)
  }

  toggldeReplyForm (flag) {
    return () => {
      this.setState(state => { state.replyForm = flag })
    }
  }

  handleChange (field, e) {
    let value = e.target.value.replace(/(<([^>]+)>)/ig, '')
    this.setState(state => {
      state.reply[field] = value
    })
  }

  async submit (e) {
    e.preventDefault()

    this.setState(state => { state.fetching = true })
    await this.props.dispatch(postReply(this.props.task._id, this.state.reply))
    this.setState(state => {
      state.fetching = false
      state.success = true
    })
  }

  render () {
    let { replyForm, fetching, success } = this.state
    let { task, replyOpened, reply, replyStatus } = this.props

    let openedFlag = replyOpened || replyForm
    let isReplied = reply || success

    return (
      <FeedLayout wide emptySide>
        <Panel Header={<div className='panel__title'>{task.title}</div>}>
          <TextWithImages text={task.content} />
        </Panel>

        { !isReplied && (
          <OverlayLoader loading={fetching}>
            { openedFlag && (
              <div>
                { task.replyType === 'goal' && <GoalReply />}

                <Panel Header={<div className='panel__title panel__title_small'>Ответ</div>}>
                  <form className='panel-form'>
                    <div className='panel-form__row'>
                      <label className='panel-form__label'>Ответ на задание</label>
                      <textarea className='panel-form__input panel-form__input_textarea' type='text' value={this.state.reply.content} onChange={this.handleChange.bind(this, 'content')} />
                    </div>
                  </form>
                </Panel>
              </div>
            )}

            <Button onClick={openedFlag ? this.submit : this.toggldeReplyForm(true)}>
              { openedFlag ? 'Отправить' : 'Ответить на задание' }
            </Button>
          </OverlayLoader>
        )}

        { (isReplied && success) && (<div>Ваш ответ отправлен на проверку</div>) }

        { (isReplied && replyStatus) && (
          <div>
            <h2>Статус проверки {replyStatus.title}</h2>
          </div>
        )}

        { (isReplied && reply) && (
          <Panel Header={<div className='panel__title'>Ваш ответ</div>}>
            {reply.title}
            {reply.content}
          </Panel>
        )}

      </FeedLayout>
    )
  }
}

TaskPage.getInitialProps = async ctx => {
  let headers = null
  if (ctx.req) headers = ctx.req.headers

  await ctx.store.dispatch(getTask(ctx.query.id, { headers }))
  await ctx.store.dispatch(getReply(ctx.query.id, { headers }))
  return { replyOpened: !isUndefined(ctx.query.reply) }
}

const mapStateToProps = ({ task }) => ({
  task: task.info,
  reply: task.reply.info,
  replyStatus: task.reply.info ? task.reply.status : null
})

export default PageHoc(TaskPage, {
  title: 'Задание',
  mapStateToProps
})

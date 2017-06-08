import qs from 'query-string'
import { isEmpty } from 'lodash'
import Router from 'next/router'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'

import Panel from '../../elements/Panel'
import PanelTitle from '../../elements/Panel/Title'
import AttachmentForm from '../PostEditor/Attachments'

import Replies from './replyForm/index'
import Button from '../../elements/Button'
import OverlayLoader from '../OverlayLoader'

import { fetchStart, fetchEnd, postReply } from '../../redux/task/reply'

class TaskReply extends Component {
  constructor (props) {
    super(props)

    this.state = {
      errors: {},
      reply: {},
      showForm: false,
      success: false
    }

    this.alreadyOpened = false
    this.submit = this.submit.bind(this)
    this.toggleForm = this.toggleForm.bind(this)
    this.onAddChange = this.onAddChange.bind(this)
    //
    this.onAttachmentAdd = this.onAttachmentAdd.bind(this)
    this.onAttachmentUpdate = this.onAttachmentUpdate.bind(this)
  }

  async submit (e) {
    e.preventDefault()
    const { replyType } = this.props
    const { reply } = this.state

    let errors = Replies[replyType].validate(reply)

    if (!isEmpty(errors)) {
      this.setState(state => { state.errors = errors })
    } else {
      if (reply.attachments) {
        reply.attachments = reply.attachments.map(el => ({
          path: el.url,
          name: el.key,
          mime: el.mime || el.type
        }))
      }

      await this.props.reply(reply)

      this.setState(state => {
        state.errors = {}
        state.success = true
      })
    }
  }

  toggleForm (flag) {
    if (!this.alreadyOpened) {
      let route = Router.router
      let query = qs.stringify({ id: route.query.id, reply: true })
      Router.replace(route.pathname + `?${query}`, route.asPath + '?reply', { shallow: true })
      this.alreadyOpened = true
    }
    this.setState(state => { state.showForm = flag })
  }

  onAddChange (field, value) {
    this.setState(state => { state.reply[field] = value })
  }

  onAttachmentAdd (data) {
    this.setState(state => {
      if (!state.reply.attachments) state.reply.attachments = []
      state.reply.attachments.push(data)
    })
  }

  onAttachmentUpdate (data) {
    this.setState(state => {
      state.reply.attachments = data
    })
  }

  render () {
    if (!this.props.task) return null

    const { replyType, opened } = this.props
    const { fetching, errors, reply, showForm, success } = this.state

    const AddForm = Replies[replyType]

    const openedFlag = opened || showForm

    return (
      <OverlayLoader loading={fetching}>
        { (success && replyType === 'report') && <div>Ваш ответ отправлен на проверку!</div>}

        { !success && (
          <div>
            { openedFlag && (
              <AttachmentForm data={reply.attachments || []} updateAttachments={this.onAttachmentUpdate} addAttachment={this.onAttachmentAdd}>
                <Panel Header={<PanelTitle small title={AddForm.title} />} bodyStyles={{ noVerticalPadding: true }}>
                  { AddForm && <AddForm onChange={this.onAddChange} affected={reply} errors={errors} /> }
                </Panel>

                { errors.attachments && errors.attachments }
              </AttachmentForm>
            )}

            <Button onClick={openedFlag ? this.submit : this.toggleForm.bind(true)}>
              { openedFlag ? 'Отправить' : 'Ответить на задание' }
            </Button>
          </div>
        ) }
      </OverlayLoader>
    )
  }
}

const mapStateToProps = ({ task }) => ({ ...task.reply })

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchEnd,
  postReply,
  fetchStart
}, dispatch)

const mergeProps = (state, dispatch, props) => {
  const reply = async data => {
    dispatch.fetchStart()
    await dispatch.postReply(props.task._id, data)
    dispatch.fetchEnd()
  }

  return {
    reply,
    ...state,
    ...props,
    replyType: props.task.replyType || 'default'
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(TaskReply)

import qs from 'query-string'
import { isEmpty, extend, pick } from 'lodash'
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

import { fetchStart, fetchEnd, postReply, editReply } from '../../redux/task/reply'

class TaskReply extends Component {
  constructor (props) {
    super(props)

    let replyData = {}
    let reply = props.reply || null

    if (props.attachments) {
      replyData.attachments = props.attachments.map(el => ({ key: el.name, hash: el._id, mime: el.mime, url: el.path, _id: el._id }))
    }
    if (reply) {
      replyData = extend(replyData, pick(reply, [ 'title', 'content' ]))
      if (props.replyType !== 'default' && reply.specific && reply.specific.item) {
        let add = Replies[props.replyType] ? Replies[props.replyType].getData(reply.specific.item) : {}
        replyData = extend(replyData, add)
      }
    }

    this.state = {
      errors: {},
      reply: replyData,
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
          mime: el.mime || el.type,
          _id: el._id
        }))
      }

      await this.props.addReply(reply)

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

  async onAttachmentAdd (data) {
    await this.setState(state => {
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

    const { replyType, edit } = this.props
    const { fetching, errors, reply, success } = this.state

    const AddForm = Replies[replyType]

    return (
      <OverlayLoader loading={fetching}>
        { (success && replyType === 'report') && <div>Ваш ответ отправлен на проверку!</div>}

        { !success && (
          <div>
            <AttachmentForm data={reply.attachments || []} updateAttachments={this.onAttachmentUpdate} addAttachment={this.onAttachmentAdd}>
              <Panel Header={<PanelTitle small title={AddForm.title} />} bodyStyles={{ noVerticalPadding: true }}>
                { AddForm && <AddForm onChange={this.onAddChange} affected={reply} errors={errors} /> }
              </Panel>

              { errors.attachments && errors.attachments }
            </AttachmentForm>

            <Button onClick={this.submit}>{ edit ? 'Сохранить изменения' : 'Ответить на задание' }</Button>
            { edit && (<Button onClick={this.props.cancelEdit}>Отменить</Button>)}
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
  editReply,
  fetchStart
}, dispatch)

const mergeProps = (state, dispatch, props) => {
  const addReply = async data => {
    dispatch.fetchStart()
    if (props.reply && props.reply._id) await dispatch.editReply(props.task._id, props.reply._id, data)
    else await dispatch.postReply(props.task._id, data)
    dispatch.fetchEnd()
  }

  return {
    addReply,
    ...state,
    ...props,
    replyType: props.task.replyType || 'default'
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(TaskReply)

import { pick, isEmpty } from 'lodash'
import { translate } from 'react-i18next'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'

import PanelMenu from '../client/components/PanelMenu'
import PageHoc from '../client/hocs/Page'
import Panel from '../client/components/Panel'
import FeedLayout from '../client/layouts/feed'

import FeedbackForm from '../client/components/Feedback/Form'
import FeedbackReplies from '../client/components/Feedback/Replies'

import { initFeedback, fetchEnd, fetchStart, submiFeedback } from '../client/redux/feedback' // eslint-disable-line

const menuItems = {
  class: { code: 'class', href: '/feedback?type=class', path: '/feedback/class', title: 'О занятии' },
  program: { code: 'program', href: '/feedback?type=program', path: '/feedback/program', title: 'О программе' },
  platform: { code: 'platform', href: '/feedback', path: '/feedback', title: 'О платформе' }
}

class FeedbackPage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      reply: {
        content: '',
        score: [ 0, 0, 0 ]
      },
      errors: {},
      submitted: false
    }

    this.submit = this.submit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (field, value, num) {
    this.setState(state => {
      if (field === 'score') state.reply.score[num] = value
      else state.reply[field] = value
    })
  }

  async submit (e) {
    e.preventDefault()
    let { reply } = this.state

    let errors = FeedbackForm.validate(reply)

    if (!isEmpty(errors)) {
      this.setState(state => { state.errors = errors })
      return
    }

    await this.setState(state => { state.errors = {} })
    await this.props.submit(reply)
  }

  render () {
    let { reply, errors } = this.state
    let { t, type, fetching, info } = this.props

    let ReplyData = this.props.reply ? FeedbackReplies[type] : null
    let menu = pick(menuItems, this.props.types)

    return (
      <FeedLayout emptySide>
        <Panel noBody noBorder menuStyles={{ noBorder: true }} Menu={() => <PanelMenu items={Object.values(menu)} selected={type} />} />

        { !ReplyData && (<FeedbackForm t={t} data={reply} type={type} errors={errors} fetching={fetching} onSubmit={this.submit} onChange={this.handleChange} />)}
        { ReplyData && (<ReplyData data={info} />)}
      </FeedLayout>
    )
  }
}

FeedbackPage.getInitialProps = async (ctx) => {
  let headers = null
  let type = ctx.query.type || 'platform'

  if (ctx.req) headers = ctx.req.headers
  await ctx.store.dispatch(initFeedback(type, { headers }))
  return { type }
}

const mapStateToProps = ({ feedback }) => ({ ...feedback })

const mapDispatchToProps = dispatch => bindActionCreators({
  initFeedback,
  fetchEnd,
  fetchStart,
  submiFeedback
}, dispatch)

const mergeProps = (state, dispatch, props) => {
  const submit = async data => {
    dispatch.fetchStart()
    await dispatch.submiFeedback(props.type, data)
    dispatch.fetchEnd()
  }

  return { submit, ...state, ...props }
}

const accessRule = user => !!user

let translated = translate([ 'common' ])(FeedbackPage)

export default PageHoc(translated, {
  title: 'Оставить отзыв',
  accessRule,
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
})

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'

import Panel from '../../client/elements/Panel'
import RightMenu from '../../client/components/NPS/RightMenu'
import PanelTitle from '../../client/elements/Panel/Title'

import PageHoc from '../../client/hocs/Page'
import VolunteerLayout from '../../client/layouts/volunteer'
import OverlayLoader from '../../client/components/OverlayLoader'

import TaskReply from '../../client/components/Tasks/Check'

import { restrictAccess } from '../../client/redux/error'
import { getNotVerified, getTotalCount, verifyTask, fetchEnd, fetchStart, toggleProcessing } from '../../client/redux/volunteer/tasks'

const drawSide = items => items.map(el => ({
  path: '/volunteer/tasks?title=' + encodeURIComponent(el._id),
  href: '/volunteer/tasks?title=' + encodeURIComponent(el._id),
  code: el._id,
  title: el._id + ' (' + el.count + ')'
}))

let menuItems = [
  { code: 'reports', href: '/volunteer/tasks', path: '/volunteer/tasks', title: 'Отчеты по ПК' }
]

class VolunteerPage extends Component {
  componentWillReceiveProps (nextProps) {
    if (nextProps.program && nextProps.program.role !== 'volunteer') nextProps.restrictAccess('Ошибка доступа')
    else {
      if (nextProps.current !== this.props.current) {
        nextProps.getTotalCount({ programId: nextProps.current })
        nextProps.getNotVerified({ programId: nextProps.current })
      }
    }
  }

  render () {
    let type = 'reports'
    let { users } = this.props
    let selectedTitle = this.props.url.query.title || null
    let { items, verified, count, fetching, processing } = this.props.tasks

    // items = []

    return (
      <VolunteerLayout subMenu={menuItems} subSelected={type} selected={'tasks'} >
        <div className='feed'>
          <div className='feed__left'>
            <OverlayLoader loading={fetching}>
              { (items.length > 0) && items.map(el => {
                if (verified.indexOf(el._id) === -1) return <TaskReply key={el._id} created={el.created} replyType={el.replyTypeId.code} task={el.taskId} post={el.postId} user={users[el.userId]} specific={el.specific} fetching={processing === el._id} onVerify={this.props.onVerify(el._id)} />
              })}

              { !items.length && (
                <a onClick={this.props.getMore}>Загрузить еще</a>
              )}
            </OverlayLoader>
          </div>

          <div className='feed__right'>
            <Panel Header={<PanelTitle small title='Задания по темам' />}>
              <RightMenu items={drawSide(count)} selected={selectedTitle} />
            </Panel>
          </div>
        </div>
      </VolunteerLayout>
    )
  }
}

VolunteerPage.getInitialProps = async ctx => {
  let headers = null
  if (ctx.req) headers = ctx.req.headers
  let { user } = ctx.store.getState()
  let { type = 'knife', title } = ctx.query
  let programId = user.programs.current

  if (ctx.isServer) await ctx.store.dispatch(getTotalCount({ programId }, { headers }))
  await ctx.store.dispatch(getNotVerified({ programId, title }, { headers }))

  return { type, title }
}

const mapStateToProps = ({ users, user, volunteer }) => ({
  users,
  current: user.programs.current,
  program: user.programs.items[user.programs.current],
  tasks: volunteer.tasks
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getTotalCount,
  getNotVerified,
  restrictAccess,
  toggleProcessing,
  verifyTask,
  fetchStart,
  fetchEnd
}, dispatch)

const mergeProps = (state, dispatch, props) => ({
  ...state,
  ...dispatch,
  ...props,
  onVerify: replyId => async type => {
    dispatch.toggleProcessing(replyId)
    await dispatch.verifyTask(replyId, type)
    await dispatch.getTotalCount({ programId: state.current })
    dispatch.toggleProcessing()
  },
  getMore: async () => {
    dispatch.fetchStart()
    await dispatch.getNotVerified({ programId: state.current, title: props.title })
    dispatch.fetchEnd()
  }
})

export default PageHoc(VolunteerPage, {
  title: 'Волонтерство',
  accessRule: (user, props) => {
    let { programs } = props.user
    let flag = (programs.items[programs.current] && programs.items[programs.current].role === 'volunteer')
    return !!user && flag
  },
  mergeProps,
  mapStateToProps,
  mapDispatchToProps
})

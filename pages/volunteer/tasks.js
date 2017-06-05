import React, { Component } from 'react'
import { bindActionCreators } from 'redux'

// import PanelTitle from '../../client/elements/Panel/Title'
import PageHoc from '../../client/hocs/Page'
import VolunteerLayout from '../../client/layouts/volunteer'

import TaskReply from '../../client/components/Tasks/Check'

import { restrictAccess } from '../../client/redux/error'
import { getNotVerified, getTotalCount, verifyTask } from '../../client/redux/volunteer/tasks'

// const drawSide = items => items.map(el => ({
//   path: '/volunteer/' + el._id,
//   href: '/volunteer?task=' + el._id,
//   code: el._id,
//   title: el.title + ' (' + el.count + ')'
// }))

let menuItems = [
  { code: 'reports', href: '', path: '', title: 'Отчеты по ПК' },
  { code: 'plans', href: '', path: '', title: 'Постановка ПК' }
]

class VolunteerPage extends Component {
  componentWillReceiveProps (nextProps) {
    if (nextProps.program.role !== 'volunteer') nextProps.restrictAccess('Ошибка доступа')
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
    let { items, verified } = this.props.tasks

    // let sidePanel = (
    //   <Panel Header={<PanelTitle small title='Задания по темам' />}>
    //     <RightMenu items={drawSide(count)} selected={task} />
    //   </Panel>
    // )
    //  emptySide Side={[ sidePanel ]}
    return (
      <VolunteerLayout subMenu={menuItems} subSelected={type} selected={'tasks'}>
        <div className='feed'>
          <div className='feed__left'>
            { (items && items.length) && items.map(el => {
              if (verified.indexOf(el._id) === -1) return <TaskReply key={el._id} created={el.created} task={el.taskId} post={el.postId} user={users[el.userId]} specific={el.specific} onVerify={this.props.onVerify(el._id)} />
            })}
          </div>

          {/* <div className='feed__right'>
            { (Side.length > 0) && Side.map(el => (
              <div key={Math.random()}>{el}</div>
            ))}
          </div> */}
        </div>
      </VolunteerLayout>
    )
  }
}

VolunteerPage.getInitialProps = async ctx => {
  let headers = null
  if (ctx.req) headers = ctx.req.headers
  let { user } = ctx.store.getState()
  let task = ctx.query.type || 'knifeplan'
  let programId = user.programs.current

  if (ctx.isServer) await ctx.store.dispatch(getTotalCount({ programId }, { headers }))
  await ctx.store.dispatch(getNotVerified({ programId }, { headers }))
  return { task }
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
  verifyTask
}, dispatch)

const mergeProps = (state, dispatch, props) => {
  const onVerify = replyId => type => dispatch.verifyTask(replyId, type)
  return {
    ...state,
    ...dispatch,
    ...props,
    onVerify
  }
}

export default PageHoc(VolunteerPage, {
  title: 'Волонтерство',
  accessRule: (user, props) => {
    let flag = props.user.programs.items[props.user.programs.current].role === 'volunteer'
    return !!user && flag
  },
  mergeProps,
  mapStateToProps,
  mapDispatchToProps
})

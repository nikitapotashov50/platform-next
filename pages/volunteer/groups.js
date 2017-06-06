import React, { Component } from 'react'
import { bindActionCreators } from 'redux'

import PageHoc from '../../client/hocs/Page'
import VolunteerLayout from '../../client/layouts/volunteer'

let menuItems = [
  { code: 'polks', href: '', path: '', title: 'Полки' },
  { code: 'hundreds', href: '', path: '', title: 'Сотни' },
  { code: 'tens', href: '', path: '', title: 'Десятки' }
]

class VolunteerPage extends Component {
  render () {
    let type = 'polks'

    return (
      <VolunteerLayout subMenu={menuItems} subSelected={type} selected={'groups'}>
        Groups
      </VolunteerLayout>
    )
  }
}

VolunteerPage.getInitialProps = async ctx => {
  // let headers = null
  // if (ctx.req) headers = ctx.req.headers
  // let { user } = ctx.store.getState()
  // let task = ctx.query.type || 'knifeplan'
  // let programId = user.programs.current

  // if (ctx.isServer) await ctx.store.dispatch(getTotalCount({ programId }, { headers }))
  // await ctx.store.dispatch(getNotVerified({ programId }, { headers }))
  // return { task }
}

const mapStateToProps = ({ users, user, volunteer }) => ({})

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

const mergeProps = (state, dispatch, props) => ({ ...state, ...dispatch, ...props })

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

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'

import isProgramRole from '../../client/components/Access/isProgramRole'

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

VolunteerPage.getInitialProps = async ctx => {}

const mapStateToProps = ({ users, user, volunteer }) => ({})

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

const mergeProps = (state, dispatch, props) => ({ ...state, ...dispatch, ...props })

export default PageHoc(isProgramRole('volunteer')(VolunteerPage), {
  title: 'Волонтерство',
  mergeProps,
  mapStateToProps,
  mapDispatchToProps
})

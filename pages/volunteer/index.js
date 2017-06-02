import React, { Component } from 'react'

import PageHoc from '../../client/hocs/Page'
import DefaultLayout from '../../client/layouts/default'

import { restrictAccess } from '../../client/redux/error'

class VolunteerPage extends Component {
  componentWillReceiveProps (nextProps) {
    if (nextProps.program.role !== 'volunteer') nextProps.dispatch(restrictAccess('Ошибка доступа'))
  }

  render () {
    return (
      <DefaultLayout>
        123
      </DefaultLayout>
    )
  }
}

const mapStateToProps = ({ user }) => ({
  program: user.programs.items[user.programs.current]
})

export default PageHoc(VolunteerPage, {
  title: 'Волонтерство',
  accessRule: (user, props) => {
    let flag = props.user.programs.items[props.user.programs.current].role === 'volunteer'
    return !!user && flag
  },
  mapStateToProps
})

import React, { Component } from 'react'
import PageHoc from '../../client/hocs/Page'
import VolunteerLayout from '../../client/layouts/volunteer'

class VolunteerPage extends Component {
  render () {
    return (
      <VolunteerLayout emptySide Side={[]} />
    )
  }
}

VolunteerPage.getInitialProps = async ctx => {
  return {}
}

export default PageHoc(VolunteerPage, {
  title: 'Волонтерство',
  accessRule: (user, props) => {
    let flag = props.user.programs.items[props.user.programs.current].role === 'volunteer'
    return !!user && flag
  }
})

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
<<<<<<< HEAD
    let flag = props.user.programs.items && props.user.programs.current && props.user.programs.items[props.user.programs.current].role === 'volunteer'
=======
    let flag = props.user.programs.items[props.user.programs.current].role === 'volunteer'
>>>>>>> 4be3b2a01a129e6a936ce5befb5943ae3fb39761
    return !!user && flag
  }
})

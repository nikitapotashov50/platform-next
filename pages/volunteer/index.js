import React, { Component } from 'react'
import PageHoc from '../../client/hocs/Page'
import FeedLayout from '../../client/layouts/feed'

class VolunteerPage extends Component {
  render () {
    return (
      <FeedLayout emptySide Side={[]}>
        123
      </FeedLayout>
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

import React, { Component } from 'react'
import PageHoc from '../../client/hocs/Page'
import VolunteerLayout from '../../client/layouts/volunteer'

import isProgramRole from '../../client/components/Access/isProgramRole'

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

export default PageHoc(isProgramRole('volunteer')(VolunteerPage), {
  title: 'Волонтерство'
})

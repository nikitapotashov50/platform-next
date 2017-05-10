import axios from 'axios'
import React, { Component } from 'react'

import NpsList from '../../client/components/NPS/List'

import Page from '../../client/hocs/Page'
import Panel from '../../client/components/Panel'
import DefaultLayout from '../../client/layouts/default'

class FeedbackResults extends Component {
  constructor (props) {
    super(props)

    this.state = {
      nps: null
    }
  }

  async componentWillMount () {
    let { data } = await axios.get('/api/feedback')

    await this.setState(state => {
      state.nps = data.nps || null
    })
  }

  render () {
    let { nps } = this.state

    return (
      <DefaultLayout>
        <div className='feed'>
          <div className='feed__left'>

            <NpsList data={nps} />

          </div>

          <div className='feed__right'>
            <Panel>
              asdasdas
            </Panel>
          </div>
        </div>
      </DefaultLayout>
    )
  }
}

export default Page(FeedbackResults)

import React, { Component } from 'react'

import PanelMenu from '../../client/components/PanelMenu'
import NpsRightMenu from '../../client/components/NPS/RightMenu'
import NpsOverall from '../../client/components/NPS/Overall'
import OverlayLoader from '../../client/components/OverlayLoader'
import Pager from '../../client/components/Pager'
import NpsList from '../../client/components/NPS/List'

import Page from '../../client/hocs/Page'
import Panel from '../../client/components/Panel'
import DefaultLayout from '../../client/layouts/default'

import { getNpsEntries, getNpsCities, getNpsTotal } from '../../client/redux/admin/nps'

let labels = {
  score_1: 'Контент',
  score_2: 'Эмоции',
  score_3: 'Организация',
  total: 'Общий'
}

let menu = [
  { href: '/admin/feedback?type=program', path: '/admin/feedback/program', code: 'program', title: 'Программы' },
  { href: '/admin/feedback?type=coach', path: '/admin/feedback/coach', code: 'coach', title: 'Группы' },
  { href: '/admin/feedback?type=platform', path: '/admin/feedback/platform', code: 'platform', title: 'Платформа' }
]

class FeedbackResults extends Component {
  static async getInitialProps (ctx) {
    let { page = 1 } = ctx.query
    let { nps } = ctx.store.getState()

    if (ctx.isServer) {
      await ctx.store.dispatch(getNpsEntries({ limit: nps.limit, page }))
      await ctx.store.dispatch(getNpsCities())
      await ctx.store.dispatch(getNpsTotal())
    }

    return { page }
  }

  constructor (props) {
    super(props)

    this.state = {
      page: props.page || 1,
      fetching: false
    }
  }

  async onNavigate (page, e) {
    e.preventDefault()
    let { query } = this.props.url

    if ((parseInt(query.page) || 1) !== page) {
      let { limit } = this.props

      await this.setState(state => {
        state.page = page
        state.fetching = true
      })

      await this.props.dispatch(getNpsEntries({ limit, page }))
      await this.setState(state => { state.fetching = false })
    }
  }

  drawCities (items) {
    let arr = []
    items.map(el => {
      arr.push({
        path: '/',
        title: (el.name || 'Город не указан') + ' (' + el.count + ')'
      })
    })

    return arr
  }

  render () {
    let { type } = this.props.url.query

    let { fetching, page } = this.state
    let { items, limit, count, cities } = this.props

    let SubHeader = (<div className='' />)

    let Pagination = null
    if (count) Pagination = <Pager total={count} current={page} limit={limit} onNavigate={this.onNavigate.bind(this)} />

    return (
      <DefaultLayout>
        <div className='feed'>
          <div className='feed__left'>

            <Panel Menu={() => <PanelMenu items={menu} selected={type} />} SubHeader={() => SubHeader}>
              <NpsOverall labels={labels} data={{ score_1: 123, score_2: 123, score_3: 123, total: 123 }} />
            </Panel>

            { count && Pagination }

            <OverlayLoader loading={fetching}>
              <NpsList data={items} labels={labels} />
            </OverlayLoader>

            { count && Pagination }

          </div>

          <div className='feed__right'>
            <Panel>
              <NpsRightMenu items={this.drawCities(cities)} />
            </Panel>
          </div>
        </div>
      </DefaultLayout>
    )
  }
}

let mapStateToProps = ({ nps }) => nps

export default Page(FeedbackResults, {
  title: 'NPS',
  mapStateToProps
})

import qs from 'query-string'
import Router from 'next/router'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'

import PanelMenu from '../../client/components/PanelMenu'
// import NpsRightMenu from '../../client/components/NPS/RightMenu'
// import NpsOverall from '../../client/components/NPS/Overall'
import OverlayLoader from '../../client/components/OverlayLoader'
import Pager from '../../client/components/Pager'
import NpsList from '../../client/components/NPS/List'

import Page from '../../client/hocs/Page'
import Panel from '../../client/elements/Panel'
import DefaultLayout from '../../client/layouts/default'

import NpsFilters from '../../client/components/Feedback/adminFilters/index'

import { getNpsEntries, getNpsCities } from '../../client/redux/admin/nps'

let labels = {
  score_1: 'Контент',
  score_2: 'Эмоции',
  score_3: 'Организация',
  total: 'Общий'
}

let menu = [
  { href: '/admin/feedback?type=program', path: '/admin/feedback/program', code: 'programs', title: 'Программы' },
  { href: '/admin/feedback?type=coach', path: '/admin/feedback/coach', code: 'coach', title: 'Группы' },
  { href: '/admin/feedback?type=platform', path: '/admin/feedback/platform', code: 'platform', title: 'Платформа' }
]

class FeedbackResults extends Component {
  static async getInitialProps (ctx) {
    // let { page = 1, type = 'program' } = ctx.query
    // let { nps } = ctx.store.getState()

    // await Promise.all([
    //   ctx.store.dispatch(getNpsEntries({ type }, { limit: nps.limit, page })),
    //   ctx.store.dispatch(getNpsCities({ type }))
    // ])
    return { type: ctx.query.type || 'programs' }
  }

  constructor (props) {
    super(props)

    this.state = {
      fetching: false
    }

    this.onNavigate = this.onNavigate.bind(this)
  }

  onNavigate (field) {
    return async (value, e) => {
      e.preventDefault()

      let { query, pathname } = this.props.url
      let { limit } = this.props.nps
      let { type } = query
      delete query.type

      let newQuery = {
        ...query,
        [field]: value
      }

      this.setState(state => { state.fetching = true })

      let href = { pathname, query: { ...newQuery, type } }
      let asHref = pathname + '/' + type + '?' + qs.stringify(newQuery)
      Router.replace(href, asHref, { shallow: true })

      await this.props.getNpsEntries({ type, city: newQuery.city || null }, { limit, page: newQuery.page || 1 })

      this.setState(state => { state.fetching = false })
    }
  }

  drawCities (items) {
    return items.map(el => ({
      path: '/',
      code: el.city_id,
      title: (el.name || 'Город не указан') + ' (' + el.count + ')',
      onClick: this.onNavigate('city')
    }))
  }

  render () {
    let { page = 1 } = this.props.url.query
    let { type } = this.props
    let { fetching } = this.state
    let { items, limit, count } = this.props.nps

    let SubHeader = NpsFilters[type]
    let Menu = () => <PanelMenu items={menu} selected={type} />
    let Pagination = null
    if (count) Pagination = <Pager total={count} current={page} limit={limit} onNavigate={this.onNavigate('page')} />

    return (
      <DefaultLayout>
        <div className='feed'>
          <div className='feed__left'>

            <Panel Menu={Menu} SubHeader={<SubHeader />}>
              {/* <NpsOverall labels={labels} data={{ score_1: 123, score_2: 123, score_3: 123, total: 123 }} /> */}
            </Panel>

            { (count > 0) && Pagination }

            <OverlayLoader loading={fetching}>
              <NpsList data={items} labels={labels} />
            </OverlayLoader>

            { (count > 0) && Pagination }

          </div>

          <div className='feed__right'>
            {/* <Panel Header={<div className='panel__title'>Города</div>}>
              <NpsRightMenu items={this.drawCities(cities)} />
            </Panel> */}
          </div>
        </div>
      </DefaultLayout>
    )
  }
}

const mapStateToProps = ({ nps }) => ({ nps })
const mapDispatchToProps = dispatch => bindActionCreators({
  getNpsEntries,
  getNpsCities
}, dispatch)

export default Page(FeedbackResults, {
  title: 'NPS',
  mapStateToProps,
  mapDispatchToProps,
  accessRule: user => false
})

import qs from 'query-string'
import Router from 'next/router'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'

import PanelMenu from '../../client/components/PanelMenu'
// import NpsRightMenu from '../../client/components/NPS/RightMenu'
import NpsOverall from '../../client/components/NPS/Overall'
import OverlayLoader from '../../client/components/OverlayLoader'
import Pager from '../../client/components/Pager'
import NpsList from '../../client/components/NPS/List'

import Page from '../../client/hocs/Page'
import Panel from '../../client/elements/Panel'
import PanelTitle from '../../client/elements/Panel/Title'
import DefaultLayout from '../../client/layouts/default'

import NpsFilters from '../../client/components/Feedback/adminFilters/index'

import { getNpsEntries, getNpsCities, getFilters, getTotal } from '../../client/redux/admin/nps'

let labels = {
  score_1: 'Контент',
  score_2: 'Эмоции',
  score_3: 'Организация',
  total: 'Общий'
}

let menu = [
  { href: '/admin/feedback?type=program', path: '/admin/feedback/program', code: 'programs', title: 'Программы' },
  // { href: '/admin/feedback?type=coach', path: '/admin/feedback/coach', code: 'coach', title: 'Группы' },
  { href: '/admin/feedback?type=platform', path: '/admin/feedback/platform', code: 'platform', title: 'Платформа' }
]

class FeedbackResults extends Component {
  static async getInitialProps (ctx) {
    let type = ctx.query.type || 'programs'
    let headers = null
    if (ctx.isServer) headers = ctx.req.headers

    await ctx.store.dispatch(getFilters(type, { headers }))
    await ctx.store.dispatch(getTotal(type, { headers }))
    await ctx.store.dispatch(getNpsEntries(type, {}, { headers }))

    return { type }
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
    let { items, limit, count, filters, total } = this.props.nps
    console.log(this.props.nps)
    let SubHeader = NpsFilters[type]
    let Menu = () => <PanelMenu items={menu} selected={type} />
    let Pagination = null
    if (count) Pagination = <Pager total={count} current={page} limit={limit} onNavigate={this.onNavigate('page')} />

    return (
      <DefaultLayout>
        <div className='feed'>
          <div className='feed__left'>

            <Panel Header={<PanelTitle title='NPS' />} Menu={Menu} SubHeader={<SubHeader data={filters} />}>
              <NpsOverall labels={labels} data={total} />
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
  accessRule: user => true
})

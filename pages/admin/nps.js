import Router from 'next/router'
import { omit } from 'lodash'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'

import PanelMenu from '../../client/components/PanelMenu'
import NpsOverall from '../../client/components/NPS/Overall'
import OverlayLoader from '../../client/components/OverlayLoader'
import Pager from '../../client/components/Pager'
import NpsList from '../../client/components/NPS/List'

import Page from '../../client/hocs/Page'
import Panel from '../../client/elements/Panel'
import PanelTitle from '../../client/elements/Panel/Title'
import DefaultLayout from '../../client/layouts/default'

import NpsFilters from '../../client/components/Feedback/adminFilters/index'

import { getNpsEntries, getNpsCities, getFilters, getTotal, updateQuery } from '../../client/redux/admin/nps'

let labels = {
  score_1: 'Контент',
  score_2: 'Эмоции',
  score_3: 'Организация',
  total: 'Общий'
}

let menu = [
  { href: '/admin/nps?type=program', path: '/admin/nps/program', code: 'program', title: 'Программы' },
  { href: '/admin/nps?type=platform', path: '/admin/nps/platform', code: 'platform', title: 'Платформа' }
]

class FeedbackResults extends Component {
  static async getInitialProps (ctx) {
    let type = ctx.query.type || 'programs'
    let headers = null
    if (ctx.isServer) headers = ctx.req.headers

    ctx.store.dispatch(updateQuery(omit(ctx.query, [ 'type' ])))
    await ctx.store.dispatch(getFilters(type, { headers }))
    await ctx.store.dispatch(getTotal(type, { headers }))
    await ctx.store.dispatch(getNpsEntries(type, omit(ctx.query, [ 'type' ]), { headers }))

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

      this.setState(state => { state.fetching = true })
      let { type } = this.props
      let query = { ...this.props.nps.query, [field]: value }
      let route = Router.router

      let href = { pathname: route.pathname, query: { ...query, type } }
      let asHref = { pathname: `${route.pathname}/${type}`, query: query }
      Router.replace(href, asHref, { shallow: true })

      await this.props.getList({ page: value })

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
    let { type } = this.props
    let { fetching } = this.state
    let { items, count, filters, total, query } = this.props.nps

    let SubHeader = NpsFilters[type] || (() => (<div />))
    let Menu = () => <PanelMenu items={menu} selected={type} />
    let Pagination = null
    if (count) Pagination = <Pager total={count} current={query.page} limit={query.limit} onNavigate={this.onNavigate('page')} />

    return (
      <DefaultLayout>
        <div className='feed'>
          <div className='feed__left'>

            <Panel Header={<PanelTitle title='NPS' />} Menu={Menu} SubHeader={<SubHeader data={filters} />}>
              <NpsOverall labels={labels} data={total.result} />
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
const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    getNpsEntries,
    getNpsCities,
    updateQuery
  }, dispatch),
  dispatch
})

const mergeProps = (state, dispatch, props) => ({
  ...state,
  ...dispatch,
  ...props,
  getList: async query => {
    query = { ...(state.nps.query || {}), ...query }
    dispatch.updateQuery(query)
    return dispatch.getNpsEntries({ type: props.type }, query)
  }
})

export default Page(FeedbackResults, {
  title: 'NPS',
  mergeProps,
  mapStateToProps,
  mapDispatchToProps
})

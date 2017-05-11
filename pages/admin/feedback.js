import axios from 'axios'
import Link from 'next/link'
import qs from 'query-string'
import Router from 'next/router'
import React, { Component } from 'react'

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
  { path: '/admin/feedback/platform', code: 'program', title: 'Программы' },
  { path: '/admin/feedback/coach', code: 'coach', title: 'Группы' },
  { path: '/admin/feedback/platform', code: 'platform', title: 'Платформа' }
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
    let { pathname, query } = this.props.url

    if ((parseInt(query.page) || 1) !== page) {
      let { limit } = this.props

      await this.setState(state => {
        state.page = page
        state.fetching = true
      })

      // query.page = page
      // Router.replace({ pathname, query }, pathname + '/' + query.type + '?' + qs.stringify({ page }))

      await this.props.dispatch(getNpsEntries({ limit, page }))
      await this.setState(state => { state.fetching = false })
    }
  }

  render () {
    let { type } = this.props.url.query
    
    let { fetching, page } = this.state
    let { items, limit, count, cities } = this.props

    let Menu = (
      <div className='panel-menu'>
        { menu && menu.map(el => (
          <div className='panel-menu__item panel-menu__item_bordered' key={'nps-meny-' + el.title}>
            <Link href={'/admin/feedback?type=' + el.code} as={el.path}>
              <a className={[ 'panel-menu__link', type === el.code ? 'panel-menu__link_active' : '' ].join(' ')}>{el.title}</a>
            </Link>
          </div>
        ))}
      </div>
    )

    let SubHeader = (<div className='' />)

    const citiesLinks = items => {
      let arr = []
      items.map(el => {
        arr.push({
          path: '/',
          title: el.name + ' (' + el.count + ')'
        })
      })

      return arr
    }

    let Pagination = null
    if (count) Pagination = <Pager total={count} current={page} limit={limit} onNavigate={this.onNavigate.bind(this)} />
    
    return (
      <DefaultLayout>
        <div className='feed'>
          <div className='feed__left'>

            <Panel Menu={() => Menu} SubHeader={() => SubHeader}>
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
              <NpsRightMenu items={citiesLinks(cities)} />
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

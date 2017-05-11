import axios from 'axios'
import Link from 'next/link'
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

let labels = {
  score_1: 'Контент',
  score_2: 'Эмоции',
  score_3: 'Организация',
  total: 'Общий'
}

let menu = [
  { path: '', title: 'Программы' },
  { path: '', title: 'Группы' },
  { path: '', title: 'Платформа' }
]

class FeedbackResults extends Component {
  static async getInitialProps (ctx) {
    let { page = 1 } = ctx.query
    let { data } = await axios.post('http://localhost:3001/api/feedback/', { limit: 40, offset: page })

    return {
      cities: data.result,
      limit: 40,
      nps: data.nps,
      count: data.count
    }
  }

  constructor (props) {
    super(props)

    let { page } = props.url.query

    this.state = {
      cities: props.cities,
      nps: props.nps,
      page: page || 1,
      count: props.count,
      fetching: false
    }
  }

  async onNavigate (page, e) {
    e.preventDefault()
    if (this.state.page === page) return false

    await this.setState(state => {
      state.fetching = true
    })

    Router.push(this.props.url.pathname + '?page=' + page)

    let { data } = await new Promise(async (resolve, reject) => {
      let { data } = await axios.post('/api/feedback', { limit: this.props.limit, offset: page })
      setTimeout(() => resolve({ data }), 0)
    })

    await this.setState(state => {
      state.nps = data.nps || null
      state.count = data.count || 0
      state.cities = data.result
      state.page = page
      state.fetching = false
    })
  }

  render () {
    let { limit } = this.props
    let { nps, count, page, fetching, cities } = this.state

    let Menu = (
      <div className='panel-menu'>
        { menu && menu.map(el => (
          <div className='panel-menu__item panel-menu__item_bordered' key={'nps-meny-' + el.title}>
            <Link href={el.path}>
              <a className={[ 'panel-menu__link' ].join(' ')}>{el.title}</a>
            </Link>
          </div>
        ))}
      </div>
    )

    let SubHeader = (
      <div className='' />
    )

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

    return (
      <DefaultLayout>
        <div className='feed'>
          <div className='feed__left'>

            <Panel Menu={() => Menu} SubHeader={() => SubHeader}>
              <NpsOverall labels={labels} data={{ score_1: 123, score_2: 123, score_3: 123, total: 123 }} />
            </Panel>

            { count && <Pager total={count} current={page} limit={limit} onNavigate={this.onNavigate.bind(this)} /> }

            <OverlayLoader loading={fetching}>
              <NpsList data={nps} labels={labels} />
            </OverlayLoader>

            { count && <Pager total={count} current={page} limit={limit} onNavigate={this.onNavigate.bind(this)} /> }

          </div>

          <div className='feed__right'>
            {/* города и коучи */}
            <Panel>
              <NpsRightMenu items={citiesLinks(cities)} />
            </Panel>
          </div>
        </div>
      </DefaultLayout>
    )
  }
}

export default Page(FeedbackResults)

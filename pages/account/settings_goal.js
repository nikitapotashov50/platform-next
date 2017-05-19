import axios from 'axios'
import { isUndefined } from 'lodash'
import { translate } from 'react-i18next'
import React, { Component } from 'react'

import SettingsLayout from '../../client/components/AccountSettings/Layout'

import Page from '../../client/hocs/Page'
import Panel from '../../client/components/Panel'
import OverlayLoader from '../../client/components/OverlayLoader'
import GoalSettings from '../../client/components/AccountSettings/Goal'

class GoalSettingsPage extends Component {
  static async getInitialProps (ctx) {
    let options = {}
    if (ctx.isServer && ctx.req) {
      options = { headers: ctx.req.headers }
    } else {
      options = { withCredentials: true }
    }

    let { data } = await axios.get(`http://dev2.molodost.bz:3000/api/me/goal`, options)

    return {
      goal: data.result.goal
    }
  }

  constructor (props) {
    super(props)

    this.state = {
      errors: {},
      affected: {},
      fetching: false
    }

    this.clear = this.clear.bind(this)
    this.submit = this.submit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.url.query.tab !== this.props.url.query.tab) this.clear()
  }

  async handleChange (field, e) {
    if ([ 'a', 'b', 'occupation' ].indexOf(field) < 0) return

    let value = e.target.value.replace(/(<([^>]+)>)/ig, '')

    if ([ 'a', 'b' ].indexOf(field) > -1) {
      value = value.replace(/[^0-9]+/g, '')
    }

    this.setState(state => {
      state.affected[field] = value
    })
  }

  async submit (e) {
    e.preventDefault()
    let errors = []
    this.setState(state => { state.fetching = true })

    let data = { ...this.props.goal, ...this.state.affected }

    if (isUndefined(data.a)) errors.push({ field: 'a', message: 'Укажите точку А' })
    if (isUndefined(data.b)) errors.push({ field: 'b', message: 'Укажите точку Б' })

    if (data.a === '') data.a = 0
    if (data.b === '') data.b = 0

    if (!data.occupation || !data.occupation.length) errors.push({ field: 'occupation', message: 'Укажите свою нишу' })
    if (parseInt(data.a) > parseInt(data.b)) errors.push({ field: 'a', message: 'Точка A не может быть больше точки Б' })

    if (errors.length) {
      let obj = {}
      errors.map(el => { obj[el.field] = el.message })

      this.setState(state => {
        state.fetching = false
        state.errors = obj
      })
    } else {
      await this.setState(state => { state.errors = {} })
      await axios.put(`http://dev2.molodost.bz:3000/api/me/goal`, data, { withCredentials: true })

      setTimeout(() => {
        this.setState(state => { state.fetching = false })
      }, 500)
    }
  }

  async clear (e) {
    e.preventDefault()
    await this.setState(state => { state.fetching = true })
    setTimeout(() => {
      this.setState(state => {
        state.fetching = false
        state.affected = {}
      })
    })
  }

  render () {
    let { t, goal } = this.props
    let { fetching, affected, errors } = this.state

    let Footer = (
      <div>
        <button className='myBtn' disabled={fetching} onClick={this.submit}>{t('common.save')}</button>
        <button className='myBtn myBtn_hollow' disabled={fetching} onClick={this.clear}>{t('common.clear')}</button>
      </div>
    )

    return (
      <SettingsLayout url={this.props.url}>
        <OverlayLoader loading={fetching}>
          <Panel Footer={Footer} bodyStyles={{ noVerticalPadding: true }} Header={<h2 className='panel__title'>{t('account.settings.goal.title')}</h2>}>

            { goal && <GoalSettings data={goal} errors={errors} affected={affected} t={t} onChange={this.handleChange} /> }

          </Panel>
        </OverlayLoader>
      </SettingsLayout>
    )
  }
}

GoalSettingsPage.displayName = 'GoalSettingsPage'

const accessRule = user => !!user

const mapStateToProps = ({ auth }) => ({
  user: auth.user
})

let translated = translate([ 'common' ])(GoalSettingsPage)

export default Page(translated, {
  title: 'Настройки профиля',
  accessRule,
  mapStateToProps
})
import axios from 'axios'
import { isEmpty } from 'lodash'
import { translate } from 'react-i18next'
import React, { Component } from 'react'

import isLogged from '../../client/components/Access/isLogged'

import SettingsLayout from '../../client/components/AccountSettings/Layout'

import Page from '../../client/hocs/Page'
import Panel from '../../client/elements/Panel'
import OverlayLoader from '../../client/components/OverlayLoader'
import GoalSettings from '../../client/components/AccountSettings/Goal'

class AccountSettings extends Component {
  static async getInitialProps (ctx) {
    let options = { withCredentials: true }
    if (ctx.isServer && ctx.req) options = { headers: ctx.req.headers }

    let prefix = ctx.isServer ? BACKEND_URL : ''

    let { data } = await axios.get(`${prefix}/api/mongo/me/goal`, options)
    return { goal: data.result.goal }
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

  async handleChange (field, value) {
    this.setState(state => {
      state.affected[field] = value
    })
  }

  async submit (e) {
    e.preventDefault()
    this.setState(state => { state.fetching = true })

    let data = { ...this.props.goal, ...this.state.affected }
    let errors = await GoalSettings.validate(data)

    if (!isEmpty(errors)) {
      this.setState(state => {
        state.fetching = false
        state.errors = errors
      })
    } else {
      await this.setState(state => { state.errors = {} })
      await axios.put(`/api/mongo/me/goal`, data, { withCredentials: true })
      this.setState(state => { state.fetching = false })
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

const mapStateToProps = ({ auth }) => ({
  user: auth.user
})

let translated = isLogged(translate([ 'common' ])(AccountSettings))

export default Page(translated, {
  title: 'Настройки профиля',
  mapStateToProps
})

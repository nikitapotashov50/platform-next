import axios from 'axios'
import _ from 'lodash'
import { translate } from 'react-i18next'
import React, { Component } from 'react'

import AccountMainSettings from '../../client/components/AccountSettings/Main'
import AccountAboutSettings from '../../client/components/AccountSettings/About'
import AccountContactsSettings from '../../client/components/AccountSettings/Contacts'
import AccountGoalSettings from '../../client/components/AccountSettings/Goal'
import AccountOtherSettings from '../../client/components/AccountSettings/Other'
import AccountAvatarSettings from '../../client/components/AccountSettings/Avatar'

import Access from '../../client/hocs/Access'
import Page from '../../client/hocs/Page'
import Panel from '../../client/components/Panel'
import SettingsLayout from '../../client/layouts/settings'
import OverlayLoader from '../../client/components/OverlayLoader'

import { updateInfo } from '../../client/redux/auth'

class AccountSettings extends Component {
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
    this.onKeyPressed = this.onKeyPressed.bind(this)
  }

  onKeyPressed (e) {
    console.log(e.keyCode)
    // this.submit()
  }

  handleChange (field, e) {
    let value = e.target.value.replace(/(<([^>]+)>)/ig, '')
    this.setState(state => {
      state.affected[field] = value
    })
  }

  async submit () {
    if (this.state.fetching || _.isEmpty(this.state.affected)) return
    let { affected } = this.state

    this.setState(state => {
      state.fetching = true
    })

    let { data } = await axios.put('/api/me/edit', affected, { withCredentials: true })
    this.props.dispatch(updateInfo(data.result.user))

    setTimeout(() => {
      this.setState(state => {
        state.fetching = false
      })
    }, 500)
  }

  clear () {
    if (this.state.fetching) return
    this.setState(state => {
      state.affected = {}
      state.errors = {}
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.url.query.tab !== this.props.url.query.tab) this.clear()
  }

  render () {
    let { t, user, url } = this.props
    let { tab = 'main' } = url.query
    let { fetching } = this.state

    let Footer = (
      <OverlayLoader loading={fetching} onKeyDown={this.onKeyPressed}>
        <button className='myBtn' disabled={fetching} onClick={this.submit}>{t('common.save')}</button>
        <button className='myBtn myBtn_hollow' disabled={fetching} onClick={this.clear}>{t('common.clear')}</button>
      </OverlayLoader>
    )

    return (
      <SettingsLayout {...this.props} tab={tab} url={url} t={t}>
        <Panel Footer={Footer} Header={<h2 className='panel__title'>{t('account.settings.' + tab + '.title')}</h2>}>
          <OverlayLoader loading={this.state.fetching}>
            { (tab === 'main') && <AccountMainSettings onChange={this.handleChange} affected={this.state.affected} user={user} t={t} /> }
            { (tab === 'contacts') && <AccountContactsSettings onChange={this.handleChange} affected={this.state.affected} user={user} t={t} /> }
            { (tab === 'about') && <AccountAboutSettings onChange={this.handleChange} affected={this.state.affected} user={user} t={t} /> }
            { (tab === 'goal') && <AccountGoalSettings onChange={this.handleChange} affected={this.state.affected} user={user} t={t} /> }
            { (tab === 'avatar') && <AccountAvatarSettings onChange={this.handleChange} affected={this.state.affected} user={user} t={t} /> }
            { (tab === 'other') && <AccountOtherSettings onChange={this.handleChange} affected={this.state.affected} user={user} t={t} /> }
          </OverlayLoader>
        </Panel>
      </SettingsLayout>
    )
  }
}

const accessRule = user => !!user

let Prepared = Access(accessRule)(translate([ 'common' ])(AccountSettings))

export default Page(Prepared, {
  title: 'Настройки профиля',
  mapStateToProps: ({ auth }) => ({
    user: auth.user
  })
})

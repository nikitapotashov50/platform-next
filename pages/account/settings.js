import _ from 'lodash'
import moment from 'moment'
import { translate } from 'react-i18next'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'

import MainSettings from '../../client/components/AccountSettings/Main'
import AboutSettings from '../../client/components/AccountSettings/About'
import ContactsSettings from '../../client/components/AccountSettings/Contacts'
// import OtherSettings from '../../client/components/AccountSettings/Other'
// import AvatarSettings from '../../client/components/AccountSettings/Avatar'

import SettingsLayout from '../../client/components/AccountSettings/Layout'

import Page from '../../client/hocs/Page'
import Panel from '../../client/elements/Panel'
import OverlayLoader from '../../client/components/OverlayLoader'

import { loadInfo, updateInfo } from '../../client/redux/user/info'

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
  }

  async componentWillMount () {
    if (this.props.user) await this.props.loadInfo()
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
    let errors = []

    await this.setState(state => { state.fetching = true })

    if (affected.birthday) {
      let formated = moment(affected.birthday, 'DD-MM-YYYY')
      if (!formated.isValid()) errors.push({ field: 'birthday', message: 'Неправильный формат даты' })
      if (moment().diff(formated) < 0) errors.push({ field: 'birthday', message: 'Вы точно не могли родиться до сегодняшнего дня' })
      if (moment().diff(formated, 'years') > 100) errors.push({ field: 'birthday', message: 'А по вам не скажешь...' })
    }

    if (errors.length) {
      errors = errors.reduce((object, item) => {
        object[item.field] = item.message
        return object
      }, {})

      this.setState(state => {
        state.fetching = false
        state.errors = errors
      })
    } else {
      await this.setState(state => { state.errors = {} })
      await this.props.updateInfo(affected)
      this.setState(state => { state.fetching = false })
    }
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
    if (!this.props.user) return null

    let { t, user, url } = this.props
    let { tab = 'main' } = url.query
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
          <Panel Footer={Footer} bodyStyles={{ noVerticalPadding: true }} Header={<h2 className='panel__title'>{t('account.settings.' + tab + '.title')}</h2>}>
            { (tab === 'main') && <MainSettings onChange={this.handleChange} errors={errors} affected={affected} user={user} t={t} /> }
            { (tab === 'contacts') && <ContactsSettings onChange={this.handleChange} affected={affected} user={user} t={t} /> }
            { (tab === 'about') && <AboutSettings onChange={this.handleChange} affected={affected} user={user} t={t} /> }
            {/* { (tab === 'avatar') && <AvatarSettings onChange={this.handleChange} affected={affected} user={user} t={t} /> } */}
            {/* { (tab === 'other') && <OtherSettings onChange={this.handleChange} affected={affected} user={user} t={t} /> } */}
          </Panel>
        </OverlayLoader>
      </SettingsLayout>
    )
  }
}

const accessRule = user => !!user

const mapStateToProps = ({ auth, user }) => ({
  user: auth.user,
  info: user.info
})

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    loadInfo,
    updateInfo
  }, dispatch),
  dispatch
})

const mergeProps = (state, dispatch, props) => ({
  ...state,
  ...dispatch,
  ...props,
  user: {
    ...state.user,
    ...state.info
  }
})

let translated = translate([ 'common' ])(AccountSettings)

export default Page(translated, {
  title: 'Настройки профиля',
  accessRule,
  mergeProps,
  mapStateToProps,
  mapDispatchToProps
})

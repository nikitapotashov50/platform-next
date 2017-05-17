import axios from 'axios'
import _ from 'lodash'
import Link from 'next/link'
import { translate } from 'react-i18next'
import React, { Component } from 'react'

import AccountMainSettings from '../../client/components/AccountSettings/Main'
import AccountAboutSettings from '../../client/components/AccountSettings/About'
import AccountContactsSettings from '../../client/components/AccountSettings/Contacts'
import AccountGoalSettings from '../../client/components/AccountSettings/Goal'
import AccountOtherSettings from '../../client/components/AccountSettings/Other'
import AccountAvatarSettings from '../../client/components/AccountSettings/Avatar'

import Page from '../../client/hocs/Page'
import Panel from '../../client/components/Panel'
import FeedLayout from '../../client/layouts/feed'
import OverlayLoader from '../../client/components/OverlayLoader'

import { updateInfo } from '../../client/redux/auth'

let tabs = [
  { code: 'main', href: '/account/settings', path: '/account/settings', title: 'Основные' },
  { code: 'contacts', href: '/account/settings?tab=contacts', path: '/account/settings/contacts', title: 'Контакты' },
  { code: 'goal', href: '/account/settings?tab=goal', path: '/account/settings/goal', title: 'Цель' },
  { code: 'about', href: '/account/settings?tab=about', path: '/account/settings/about', title: 'О себе' },
  { code: 'avatar', href: '/account/settings?tab=avatar', path: '/account/settings/contacts', title: 'Аватар и фон' },
  { code: 'other', href: '/account/settings?tab=other', path: '/account/settings/other', title: 'Дополнительно' }
]

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

    let Side = (
      <Panel Header={<div className='panel__title'>{t('account.settings.title')}</div>}>
        <ul className='side-links'>
          { tabs.map(el => (
            <li className={[ 'side-links__item' ]} key={'settings-tab-' + el.title}>
              <Link href={el.href} as={el.path}>
                { tab === el.code
                  ? <span className='side-links__link'>{t('account.settings.' + el.code + '.title')}</span>
                  : <a className='side-links__link'>{t('account.settings.' + el.code + '.title')}</a>
                }
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    )

    return (
      <FeedLayout Side={[ Side ]}>
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

        <style jsx>{`
          .side-links {}
          .side-links__item {
            padding: 7px 0;
          }
          .side-links__link {}
        `}</style>
      </FeedLayout>
    )
  }
}

const accessRule = user => !!user

const mapStateToProps = ({ auth }) => ({
  user: auth.user
})

let translated = translate([ 'common' ])(AccountSettings)

export default Page(translated, {
  title: 'Настройки профиля',
  accessRule,
  mapStateToProps
})

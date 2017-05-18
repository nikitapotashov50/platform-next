import { translate } from 'react-i18next'
import React, { Component } from 'react'

import { server } from '../../config'
import SettingsLayout from '../../client/components/AccountSettings/Layout'

import Page from '../../client/hocs/Page'
import Panel from '../../client/components/Panel'
import OverlayLoader from '../../client/components/OverlayLoader'
import GoalSettings from '../../client/components/AccountSettings/Goal'

class AccountSettings extends Component {
  static async getInitialProps (ctx) {
    // let options = {}
    // if (ctx.isServer && ctx.req) {
    //   options = { headers: ctx.req.headers }
    // } else {
    //   options = { withCredentials: true, headers: { 'Access-Control-Allow-Credentials': 'include' } }
    // }
    // console.log(ctx.req.headers)

    // let response = await axios.get(`http://${server.host}:${server.port}/api/me/goal`, options)
    // let response = await fetch(`http://${server.host}:${server.port}/api/me/goal`, { method: 'GET' })
    // let data = await response.json()
    // console.log(data)
    return {
      goal: null
    }
  }

  constructor (props) {
    super(props)

    this.state = {
      errors: {},
      affected: {},
      fetching: false
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.url.query.tab !== this.props.url.query.tab) this.clear()
  }

  render () {
    let { t, goal } = this.props
    let { fetching, affected } = this.state

    let Footer = (
      <div>
        <button className='myBtn' disabled={fetching}>{t('common.save')}</button>
        <button className='myBtn myBtn_hollow' disabled={fetching}>{t('common.clear')}</button>
      </div>
    )

    return (
      <SettingsLayout url={this.props.url}>
        <OverlayLoader loading={fetching}>
          <Panel Footer={Footer} Header={<h2 className='panel__title'>{t('account.settings.' + this.props.url.tab + '.title')}</h2>}>

            { goal && <GoalSettings data={goal} affected={affected} t={t} /> }

          </Panel>
        </OverlayLoader>
      </SettingsLayout>
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

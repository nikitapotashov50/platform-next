import { translate } from 'react-i18next'

import AccountMainSettings from '../../client/components/AccountSettings/Main'
import AccountAboutSettings from '../../client/components/AccountSettings/About'
import AccountContactsSettings from '../../client/components/AccountSettings/Contacts'

import Access from '../../client/hocs/Access'
import Page from '../../client/hocs/Page'
import Panel from '../../client/components/Panel'
import SettingsLayout from '../../client/layouts/settings'

const AccountSettings = ({ t, user, url, ...props }) => {
  let { tab = 'main' } = url.query

  return (
    <SettingsLayout {...props} tab={tab} url={url} t={t}>
      <Panel Footer={() => <button className='myBtn'>{t('common.save')}</button>} Header={<h2 className='panel__title'>{t('account.settings.tab.' + tab + '.title')}</h2>}>

        { (tab === 'main') && <AccountMainSettings user={user} /> }
        { (tab === 'contacts') && <AccountContactsSettings user={user} /> }
        { (tab === 'about') && <AccountAboutSettings user={user} /> }

      </Panel>
    </SettingsLayout>
  )
}

const accessRule = user => !!user

let Prepared = Access(accessRule)(translate([ 'common' ])(AccountSettings))

export default Page(Prepared, {
  title: 'Настройки профиля',
  mapStateToProps: ({ auth }) => ({
    user: auth.user
  })
})

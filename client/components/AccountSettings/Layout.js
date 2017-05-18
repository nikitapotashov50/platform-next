import { translate } from 'react-i18next'

import SideMenu from '../SideMenu'
import FeedLayout from '../../layouts/feed'
import Panel from '../Panel'

let tabs = [
  { code: 'main', href: '/account/settings', path: '/account/settings' },
  { code: 'contacts', href: '/account/settings?tab=contacts', path: '/account/settings/contacts' },
  { code: 'goal', href: '/account/settings_goal?tab=goal', path: '/account/settings/goal' },
  { code: 'about', href: '/account/settings?tab=about', path: '/account/settings/about' }
  // { code: 'avatar', href: '/account/settings?tab=avatar', path: '/account/settings/avatar' },
  // { code: 'other', href: '/account/settings?tab=other', path: '/account/settings/other' }
]

const AccountSettingsLayout = ({ t, url, children }) => {
  let { tab = 'main' } = url.query

  let Side = (
    <Panel Header={<div className='panel__title'>{t('account.settings.title')}</div>}>
      <SideMenu items={tabs} selected={tab} t={t} />
    </Panel>
  )

  return (
    <FeedLayout Side={[ Side ]}>
      {children}
    </FeedLayout>
  )
}

export default translate([ 'common' ])(AccountSettingsLayout)

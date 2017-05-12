import Link from 'next/link'
import { translate } from 'react-i18next'

import Panel from '../components/Panel'
import DefaultLayout from './default'

let tabs = [
  { code: 'main', href: '/account/settings', path: '/account/settings', title: 'Основные' },
  { code: 'contacts', href: '/account/settings?tab=contacts', path: '/account/settings/contacts', title: 'Контакты' },
  { code: 'goal', href: '/account/settings?tab=goal', path: '/account/settings/goal', title: 'Цель' },
  { code: 'about', href: '/account/settings?tab=about', path: '/account/settings/about', title: 'О себе' },
  { code: 'avatar', href: '/account/settings?tab=avatar', path: '/account/settings/contacts', title: 'Аватар и фон' },
  { code: 'other', href: '/account/settings?tab=other', path: '/account/settings/other', title: 'Дополнительно' }
]

const SettingsLayout = ({ children, tab, t, ...props }) => {
  return (
    <DefaultLayout>
      <div className='user-page'>
        <div className='user-page__content'>
          <div className='user-page__content-block user-page__content-block_side'>

            <Panel Header={<div className='panel__title'>{t('settings.title')}</div>}>
              <ul className='side-links'>
                { tabs.map(el => (
                  <li className={[ 'side-links__item' ]} key={'settings-tab-' + el.title}>
                    <Link href={el.href} as={el.path}>
                      { tab === el.code
                        ? <span className='side-links__link'>{t('account.settings.tab.' + el.code + '.title')}</span>
                        : <a className='side-links__link'>{t('account.settings.tab.' + el.code + '.title')}</a>
                      }
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>

          </div>
          <div className='user-page__content-block user-page__content-block_body'>

            {children}

          </div>
        </div>
      </div>
      <style jsx>{`
        .side-links {}
        .side-links__item {
          padding: 7px 0;
        }
        .side-links__link {}
      `}</style>
    </DefaultLayout>
  )
}

export default translate([ 'common' ])(SettingsLayout)

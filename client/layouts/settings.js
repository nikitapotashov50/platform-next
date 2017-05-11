import Link from 'next/link'
import { translate } from 'react-i18next'

import Panel from '../components/Panel'
import DefaultLayout from './default'

let tabs = [
  { path: '/account/settings', title: 'Основные' },
  { path: '/account/settings/goal', title: 'Цель' },
  { path: '/account/settings/programs', title: 'Программы' }
]

const SettingsLayout = ({ children, t, ...props }) => {
  let { pathname } = props.url

  return (
    <DefaultLayout>
      <div className='user-page'>
        <div className='user-page__header'>
          <h1>{t('settings.title')}</h1>
        </div>
        <div className='user-page__content'>
          <div className='user-page__content-block user-page__content-block_side'>

            <Panel>
              { tabs.map(el => (
                <div key={'settings-tab-' + el.title}>
                  <Link href={el.path}>
                    { pathname === el.path ? <span>{el.title}</span> : <a>{el.title}</a> }
                  </Link>
                </div>
              ))}
            </Panel>

          </div>
          <div className='user-page__content-block user-page__content-block_body'>

            {children}

          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default translate([ 'common' ])(SettingsLayout)

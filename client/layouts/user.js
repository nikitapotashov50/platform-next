import Link from 'next/link'

import DefaultLayout from './default'
import Panel from '../components/Panel'
import UserProfileBadge from '../components/User/ProfileBadge'
import UserProfileGroups from '../components/User/ProfileGroups'
import UserProfileSubscribers from '../components/User/ProfileSubscribers'

const UserLayout = ({ user, children, ...props }) => {
  if (!user) return (
    <DefaultLayout>
      <Link href='/@bm-paperdoll/settings'>
        <a>Ссылка</a>
      </Link>
      <div className='user-page'>Пользоветель не найден</div>
    </DefaultLayout>
  )

  let panelBodyStyles = { padding: 'small' }

  return (
    <DefaultLayout>
      <div className='user-page'>
        <div className='user-page__header'>
          
          <div className='up-header'>
            <img className='up-header__image' src='' alt='' />

            <div className='up-header__buttons'>
              <button className='up-header__button'>Блокировать</button>
              <button className='up-header__button'>Подписаться</button>
            </div>
          </div>

        </div>

        <div className='user-page__content'>
          <div className='user-page__content-block user-page__content-block_side'>
            {/* Информация */}
            <Panel bodyStyles={panelBodyStyles}>
              <UserProfileBadge {...user} />
            </Panel>

            {/* Цель */}
            <Panel bodyStyles={panelBodyStyles}>
              <div className='user-side-panel'>
                <div className='user-side-panel__title'> Цель</div>
              </div>

              <div className='profile-goal'>
                <div className='profile-goal__block profile-goal__block_a'>100 000 ₽</div>
                <div className='profile-goal__block profile-goal__block_b'>200 000 ₽</div>
              </div>
            </Panel>

            {/* Подписки */}
            <Panel bodyStyles={panelBodyStyles}>
              <UserProfileSubscribers />
            </Panel>

            {/* Группы */}
            <Panel bodyStyles={panelBodyStyles}>
              <UserProfileGroups />
            </Panel>

            {/* Ищу могу */}
            <Panel bodyStyles={panelBodyStyles}>
              
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

export default UserLayout

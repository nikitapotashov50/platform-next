import Link from 'next/link'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { subscribeToUser, unsubscribeFromUser, addToBlackList, removeFromBlackList } from '../redux/auth'

import DefaultLayout from './default'
import Panel from '../components/Panel'
import UserProfileBadge from '../components/User/ProfileBadge'
import UserProfileGroups from '../components/User/ProfileGroups'
import UserProfileSubscribers from '../components/User/ProfileSubscribers'

const UserLayout = ({ user, groups, showButtons, subscriptions, isSubscribed, isBlocked, toggleBlock, toggleSubscription, children, ...props }) => {
  if (!user) {
    return (
      <DefaultLayout>
        <Link href='/@bm-paperdoll/settings'>
          <a>Ссылка</a>
        </Link>
        <div className='user-page'>Пользоветель не найден</div>
      </DefaultLayout>
    )
  }

  let panelBodyStyles = { padding: 'small' }

  let bgImageStyles = {}
  if (user.picture_large) bgImageStyles.backgroundImage = `url(${user.picture_large})`

  return (
    <DefaultLayout>
      <div className='user-page'>
        <div className='user-page__header'>

          <div className='up-header' style={bgImageStyles}>
            <img className='up-header__image' src={user.picture_small} alt={user.first_name + ' ' + user.last_name} />

            { showButtons && (
              <div className='up-header__buttons'>
                <button className={[ 'up-header__button', isBlocked ? 'up-header__button_active' : '' ].join(' ')} onClick={toggleBlock}>Блокировать</button>
                <button className={[ 'up-header__button', isSubscribed ? 'up-header__button_active' : '' ].join(' ')} onClick={toggleSubscription}>Подписаться</button>
              </div>
            ) }
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
            { subscriptions.length && (
              <Panel bodyStyles={panelBodyStyles}>
                <UserProfileSubscribers items={subscriptions} />
              </Panel>
            )}

            {/* Группы */}
            { groups.length && (
              <Panel bodyStyles={panelBodyStyles}>
                <UserProfileGroups groups={groups} />
              </Panel>
            )}

            {/* Ищу могу */}
            {/* <Panel bodyStyles={panelBodyStyles} /> */}
          </div>

          <div className='user-page__content-block user-page__content-block_body'>
            {children}
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

const mapStateToProps = ({ profile, auth }) => ({
  me: auth.user,
  user: profile.user,
  groups: profile.groups,
  subscriptions: profile.subscriptions,
  isBlocked: profile.user ? (auth.blackList.indexOf(profile.user.id) !== -1) : false,
  isSubscribed: profile.user ? (auth.subscriptions.indexOf(profile.user.id) !== -1) : false
})

const mapDispatchToProps = dispatch => bindActionCreators({
  subscribe: subscribeToUser,
  unsubscribe: unsubscribeFromUser,
  block: addToBlackList,
  unblock: removeFromBlackList
}, dispatch)

const mergeProps = (state, dispatch, props) => {
  let userId = state.user ? state.user.id : null
  const toggleBlock = () => state.isBlocked ? dispatch.unblock(userId) : dispatch.block(userId)
  const toggleSubscription = () => state.isSubscribed ? dispatch.unsubscribe(userId) : dispatch.subscribe(userId)

  return {
    ...props,
    ...state,
    toggleBlock,
    toggleSubscription,
    showButtons: userId && state.me && (userId !== state.me.id)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(UserLayout)

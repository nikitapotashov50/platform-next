import { pick } from 'lodash'
import React, { Component } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addToBlackList, removeFromBlackList } from '../redux/auth'
import { subscribeToUser, unsubscribeFromUser } from '../redux/user/subscriptions'

import DefaultLayout from './default'
import Panel from '../elements/Panel'

import UserProfileGoal from '../components/User/ProfileGoal'
import UserProfileBadge from '../components/User/ProfileBadge'
import UserProfileGroups from '../components/User/ProfileGroups'
import UserProfileSubscribers from '../components/User/ProfileSubscribers'

class UserLayout extends Component {
  render () {
    let { user, groups, showButtons, subscribers, isSubscribed, subscriptions, toggleSubscription, fetching, children } = this.props
    // isBlocked, toggleBlock,

    let panelBodyStyles = { padding: 'small' }

    let bgImageStyles = {}
    if (user.picture_large) bgImageStyles.backgroundImage = `url(${user.picture_large})`

    let goal = pick(user, [ 'occupation', 'a', 'b', 'fact' ])

    return (
      <DefaultLayout>
        <div className='user-page'>
          <div className='user-page__header'>

            <div className='up-header' style={bgImageStyles}>
              <img className='up-header__image' src={user.picture_small} alt={user.first_name + ' ' + user.last_name} />

              { showButtons && (
                <div className='up-header__buttons'>
                  <button className={[ 'up-header__button', isSubscribed ? 'up-header__button_active' : '' ].join(' ')}>Написать сообщение</button>
                  {/* <button className={[ 'up-header__button', isBlocked ? 'up-header__button_active' : '' ].join(' ')} onClick={toggleBlock}>Блокировать</button> */}
                  <button className={[ 'up-header__button', isSubscribed ? 'up-header__button_active' : '' ].join(' ')} onClick={toggleSubscription}>Подписаться</button>
                </div>
              ) }
            </div>

          </div>

          <div className='user-page__content'>
            <div className='user-page__content-block user-page__content-block_side'>
              {/* Информация */}
              <Panel bodyStyles={panelBodyStyles}>
                <UserProfileBadge {...user} {...goal} />
              </Panel>

              {/* Цель */}
              { goal && <UserProfileGoal goal={goal} />}

              { !fetching && (
                <div>
                  {/* Подписчики */}
                  { (subscribers.length !== 0) && (
                    <Panel bodyStyles={panelBodyStyles}>
                      <UserProfileSubscribers items={subscribers} title={'Подписчики (' + this.props.subscribers_total + ')'} />
                    </Panel>
                  )}

                  {/* Подписки */}
                  { (subscriptions > 0) && (
                    <Panel bodyStyles={panelBodyStyles}>
                      <div className='user-side-panel'>
                        <div className='user-side-panel__title'>Подписки ({subscriptions})</div>
                      </div>
                    </Panel>
                  )}

                  {/* Группы */}
                  { (groups.length !== 0) && (
                    <Panel bodyStyles={panelBodyStyles}>
                      <UserProfileGroups groups={groups} />
                    </Panel>
                  )}
                </div>
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
}

const mapStateToProps = ({ profile, auth, user }) => ({
  ...profile,
  me: auth.user,
  isBlocked: profile.user && auth.blackList ? (auth.blackList.indexOf(profile.user._id) !== -1) : false,
  isSubscribed: ((user.subscriptions || []).indexOf(profile.user._id) !== -1) || false
})

const mapDispatchToProps = dispatch => bindActionCreators({
  subscribe: subscribeToUser,
  unsubscribe: unsubscribeFromUser,
  block: addToBlackList,
  unblock: removeFromBlackList
}, dispatch)

const mergeProps = (state, dispatch, props) => {
  let userId = state.user ? state.user._id : null
  const toggleBlock = () => state.isBlocked ? dispatch.unblock(userId) : dispatch.block(userId)
  const toggleSubscription = () => state.isSubscribed ? dispatch.unsubscribe(userId) : dispatch.subscribe(userId)

  return {
    ...props,
    ...state,
    //
    toggleBlock,
    toggleSubscription,
    showButtons: userId && state.me && (userId !== state.me._id)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(UserLayout)

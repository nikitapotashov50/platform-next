import Link from 'next/link'
import axios from 'axios'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import SearchIcon from 'react-icons/lib/fa/search'

import Programs from './Programs'
import UserImage from '../User/Image'
import UserHeaderMenu from '../User/HeaderMenu'
import ChatButton from './ChatButton'
import Chat from '../Chat/index'

import { logout } from '../../redux/auth'
import { changeCurrent as changeCurrentProgram } from '../../redux/user/programs'
import {
  login, getChatList, getMessageList, listen, sendMessage,
  toggleChatWindow, closeChatWindow, selectChat, setChatsFilterQuery,
  sendWelcomeMessage, acceptFriend
} from '../../redux/chat'

const getCurrentPrefix = programs => {
  let current = programs.items[programs.current]
  if (!current) return
  return current.alias.split('-')[0]
}

class HeaderRegisteredMenu extends Component {
  constructor (props) {
    super(props)

    this.state = {
      menu: false,
      programMenu: false
    }
    this.togglePrograms = this.togglePrograms.bind(this)
    this.changeProgram = this.changeProgram.bind(this)
  }

  async toggleMenu (flag) {
    await this.setState(state => { state.menu = flag })
  }

  async logout (e) {
    e.preventDefault()
    await axios.post('/api/auth/logout', {}, { withCredentials: true })

    await this.toggleMenu(false)
    this.props.dispatch(logout())
  }

  async changeProgram (value) {
    this.props.dispatch(changeCurrentProgram(value || 3))
  }

  togglePrograms (flag) {
    this.setState({ programMenu: flag })
  }

  componentDidMount () {
    if (this.props.user.radar_access || this.props.isChatAuth) {
      this.props.listen()
      this.props.getChatList()
    }
  }

  render () {
    let { menu, programMenu } = this.state
    let {className, user, programs} = this.props

    return (
      <div className={[ className ].join(' ')}>

        <li className='user-menu__item user-menu__item_hoverable'>
          <Link href='/search'><a className='user-menu__item_search-icon'><SearchIcon /></a></Link>
        </li>

        <li className='user-menu__item user-menu__item_hoverable'>
          <ChatButton
            notificationCount={this.props.user.radar_access ? 0 : 1}
            handleClick={this.props.toggleChatWindow} />
        </li>

        {this.props.showChatWindow && (
          <Chat
            you={this.props.user}
            auth={this.props.user.radar_access || this.props.isChatAuth}
            login={this.props.login}
            chats={this.props.chatList}
            currentChat={this.props.selectedChat}
            sendMessage={this.props.sendMessage}
            sendWelcomeMessage={this.props.sendWelcomeMessage}
            getChatList={this.props.getChatList}
            filterQuery={this.props.chatsFilterQuery}
            setFilterQuery={this.props.setChatsFilterQuery}
            acceptFriend={this.props.acceptFriend}
            getMessageList={this.props.getMessageList}
            onSelect={chatId => {
              this.props.selectChat(chatId)
              this.props.getMessageList(chatId)
            }}
            handleClickOutside={this.props.closeChatWindow} />
        )}

        { !isEmpty(programs.items) && (
          <li className='user-menu__item user-menu__item_hoverable'>
            <div className={`programs-selected programs-selected_${getCurrentPrefix(programs)}`} onClick={this.togglePrograms.bind(this, !programMenu)}>
              { programMenu && <Programs items={programs.items} current={programs.current} onChange={this.changeProgram} />}
            </div>
          </li>
        )}

        <li className='user-menu__item user-menu__item_hoverable' onClick={this.toggleMenu.bind(this, !menu)}>
          <UserImage small user={user} />

          <UserHeaderMenu opened={menu} user={user} logout={this.logout.bind(this)} onClose={this.toggleMenu.bind(this, false)} />
        </li>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  programs: state.user.programs,
  showChatWindow: state.chat.showChatWindow,
  // chatList: getFilteredChatList(state),
  chatList: state.chat.chats,
  isChatAuth: state.chat.auth,
  selectedChat: state.chat.selectedChat,
  chatsFilterQuery: state.chat.chatsFilterQuery
})

const mapDispatchToProps = dispatch => bindActionCreators({
  login,
  listen,
  getChatList,
  getMessageList,
  sendMessage,
  sendWelcomeMessage,
  toggleChatWindow,
  closeChatWindow,
  selectChat,
  setChatsFilterQuery,
  acceptFriend
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(HeaderRegisteredMenu)

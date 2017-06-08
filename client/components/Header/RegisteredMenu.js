import axios from 'axios'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'

import Programs from './Programs'
import UserImage from '../User/Image'
import UserHeaderMenu from '../User/HeaderMenu'
import ChatButton from './ChatButton'
import Chat from '../Chat/index'

import { logout } from '../../redux/auth'
import { changeCurrent as changeCurrentProgram } from '../../redux/user/programs'
import {
  login, getChatList, getMessageList, listen, sendMessage,
  toggleChatWindow, closeChatWindow, selectChat
} from '../../redux/chat'

const getCurrentPrefix = programs => {
  let current = programs.items[programs.current]
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
    // this.props.getChatList()
    if (this.props.user.radar_access || this.props.isChatAuth) {
      this.props.listen()
    }
  }

  render () {
    let { menu, programMenu } = this.state
    let {className, user, programs} = this.props

    return (
      <div className={[ className ].join(' ')}>

        <li className='user-menu__item user-menu__item_hoverable'>
          <ChatButton
            notificationCount={1}
            handleClick={() => {
              this.props.toggleChatWindow()
              this.props.getChatList()
            }} />
        </li>

        {this.props.showChatWindow && (
          <Chat
            you={this.props.user}
            auth={this.props.user.radar_access || this.props.isChatAuth}
            login={this.props.login}
            chats={this.props.chatList}
            currentChat={this.props.selectedChat}
            sendMessage={this.props.sendMessage}
            getChatList={this.props.getChatList}
            onSelect={(chatId, cb) => {
              this.props.selectChat(chatId)
              this.props.getMessageList(chatId)
              cb()
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

const mapStateToProps = ({ auth, user, chat }) => ({
  user: auth.user,
  programs: user.programs,
  showChatWindow: chat.showChatWindow,
  chatList: chat.chats,
  isChatAuth: chat.auth,
  selectedChat: chat.selectedChat
})

const mapDispatchToProps = dispatch => bindActionCreators({
  login,
  listen,
  getChatList,
  getMessageList,
  sendMessage,
  toggleChatWindow,
  closeChatWindow,
  selectChat
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(HeaderRegisteredMenu)

import axios from 'axios'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'

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

class HeaderRegisteredMenu extends Component {
  constructor (props) {
    super(props)

    this.state = {
      menu: false
    }
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

  async changeProgram (e) {
    let val = e.target.value
    this.props.dispatch(changeCurrentProgram(val.length ? val : null))
  }

  drawPrograms (items) {
    let result = []
    for (var i in items) {
      result.push(
        <option value={items[i]._id} key={'program-' + items[i]._id}>{items[i].title}</option>
      )
    }
    return result
  }

  componentDidMount () {
    // this.props.getChatList()
    // this.props.listen()
  }

  render () {
    let { menu } = this.state
    let {className, user, programs} = this.props

    return (
      <div className={[ className ].join(' ')}>

        <li className='user-menu__item user-menu__item_hoverable'>
          <ChatButton
            notificationCount={1}
            handleClick={this.props.toggleChatWindow} />
        </li>

        {this.props.showChatWindow && (
          <Chat
            auth={this.props.isChatAuth}
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
            <select onChange={this.changeProgram} value={programs.current || ''}>
              {this.drawPrograms(programs.items || [])}
            </select>

            <div className='programs-menu__wrap'>
              <div className='programs-menu__item programs-menu__item-ceh programs-menu__item-active'>24</div>
              <div className='programs-menu__item programs-menu__item-mzs'>18</div>
              <div className='programs-menu__item programs-menu__item-main' />

              <div className='programs-menu__old'>
                <span>Прошедшие курсы</span>
              </div>

              <div className='programs-menu__item programs-menu__item-ceh programs-menu__item-old'>23</div>
              <div className='programs-menu__item programs-menu__item-mzs programs-menu__item-old'>17</div>
              <div className='programs-menu__item programs-menu__item-ceh programs-menu__item-old'>22</div>
              <div className='programs-menu__item programs-menu__item-mzs programs-menu__item-old'>16</div>

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

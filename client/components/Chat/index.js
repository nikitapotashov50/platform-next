import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import clickOutside from 'react-click-outside'
import classNames from 'classnames'
// import { map, reverse } from 'lodash'
// import shortid from 'shortid'

import ChatWindow from './Window'
import Message from './Message'
import ChatLoginForm from './LoginForm'

class Chat extends Component {
  constructor (props) {
    super(props)

    this.state = {
      newMessageText: ''
    }

    this.getMessages = this.getMessages.bind(this)
    this.getCurrentChat = this.getCurrentChat.bind(this)
    this.scrollToEnd = this.scrollToEnd.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
  }

  handleClickOutside () {
    this.props.handleClickOutside()
  }

  componentDidMount () {
    this.scrollToEnd()
  }

  componentDidUpdate () {
    this.scrollToEnd()
  }

  getCurrentChat () {
    const currentChat = this.props.chats.filter(chat => chat.chatId === this.props.currentChat)
    return currentChat[0] || {}
  }

  getMessages () {
    const currentChat = this.getCurrentChat()

    if (!currentChat || !currentChat.messages) {
      return []
    }

    return currentChat.messages
  }

  scrollToEnd () {
    const node = findDOMNode(this.end)
    node && node.scrollIntoView()
  }

  sendMessage () {
    if (!this.state.newMessageText) return

    this.props.sendMessage(
      this.props.currentChat,
      this.state.newMessageText
    )

    this.setState({
      newMessageText: ''
    })
  }

  sendWelcomeMessage () {
    if (!this.state.newMessageText) return

    this.props.sendWelcomeMessage(
      this.props.currentChat,
      this.state.newMessageText
    )

    this.setState({
      newMessageText: ''
    })
  }

  render () {
    if (!this.props.auth) {
      return (
        <ChatWindow>
          <ChatLoginForm
            submit={this.props.login}
            onSuccess={() => {
              this.props.getChatList()
            }}
            onError={() => {
              console.log('error')
            }} />
        </ChatWindow>
      )
    }

    return (
      <div className='chat-container'>

        <div className='chat-list'>
          <div className='chat-search'>
            <input type='text' value={this.props.filterQuery} placeholder='Поиск' onChange={e => {
              const query = e.target.value
              this.props.setFilterQuery(query)
            }} />
          </div>

          <div className='chat-list-area'>
            {this.props.chats.map(chat => (
              <div key={chat.chatId} className={classNames('chat-conversation', {
                current: this.props.currentChat === chat.chatId
              })} onClick={() => {
                this.props.onSelect(chat.chatId)
              }}>

                <div>
                  <img className='chat-avatar' src={chat.avatar} />
                </div>
                <div className='chat-conversation-detail'>
                  <div className='chat-name'>
                    {chat.chatName}
                  </div>
                  {chat.lastMessage && (
                    <div className='chat-last-message'>
                      {chat.lastMessage.userId === this.props.you.radar_id && (
                        <span><span className='chat-last-message-author'>
                          {this.props.you.first_name}
                        </span>: </span>
                      )}
                      {chat.lastMessage.text.substring(0, 15) + '...'}
                    </div>
                  )}
                </div>
                {chat.unreadMessageCount > 0 && <div className='unread-count'>
                  {chat.unreadMessageCount}
                </div>}

              </div>
            ))}
          </div>
        </div>

        {!this.props.currentChat && (
          <div className='no-selected-chat'>
            Выберите чат
          </div>
        )}

        {this.props.currentChat && (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {this.getCurrentChat().chatMemberStatus === 'invited' && (
              <div>
                <p className='message__invite-title'>Пользователь отправил вам приглашение для общения с ним</p>
                <button
                  onClick={() => {
                    this.props.acceptFriend(this.getCurrentChat().userId)
                    this.props.getMessageList(this.getCurrentChat().chatId)
                  }}
                  className='message__invite-accept'>
                  Принять приглашение
                </button>
                <button onClick={() => {}} className='message__invite-decline'>Отказаться</button>
              </div>
            )}
            <div className='message-list'>
              {this.getMessages().map(message => (
                <Message
                  key={message.messageId}
                  you={this.props.you}
                  isGroup={this.getCurrentChat().isGroup}
                  {...message} />
              ))}
              <div ref={node => { this.end = node }} />
            </div>

            <div className='message-form'>
              <input
                type='text'
                placeholder='Написать сообщение'
                value={this.state.newMessageText}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    const { isNoFriend } = this.getCurrentChat()

                    if (isNoFriend) {
                      this.sendWelcomeMessage()
                      return
                    }

                    this.sendMessage()
                  }
                }}
                onChange={e => {
                  this.setState({
                    newMessageText: e.target.value
                  })
                }} />
              <button onClick={() => {
                const { isNoFriend } = this.getCurrentChat()

                if (isNoFriend) {
                  this.sendWelcomeMessage()
                  return
                }

                this.sendMessage()
              }}>
                <div className='message-send-btn' />
              </button>
            </div>
          </div>
        )}

        <style jsx>{`
          .chat-container {
            position: fixed;
            display: flex;
            background: #fff;
            width: 700px;
            top: 60px;
            box-sizing: border-box;
            right: 30px;
            border-radius: 3px;
            box-shadow: 0px 12px 46px 0px rgba(45, 45, 45, .41);
            max-height: 500px;
            overflow: auto;
          }

          .chat-list {
            width: 260px;
            min-width: 260px;
            max-width: 260px;
            border-right: 1px solid #E6E8E9;
          }

          .chat-list-area {
            height: 379px;
          }

          .chat-list-area {
            overflow-x:hidden;
            overflow-y:scroll;
            margin: 0 3px 0 0;
          }
          .chat-list-area::-webkit-scrollbar {
            width:8px;
          }

          .chat-list-area::-webkit-scrollbar * {
            background:transparent;
            border-radius: 5px;
          }

          .chat-list-area::-webkit-scrollbar-thumb {
            background:#edeeee !important;
            border-radius: 5px;
          }

          .message-list {
            flex-grow: 1;
            padding: 10px;
            display: flex;
            flex-direction: column;
            max-height: 350px;
            overflow: auto;
            margin-right: 3px;
          }

          .message-list::-webkit-scrollbar {
            width:8px;
          }

          .message-list::-webkit-scrollbar * {
            background:transparent;
            border-radius: 5px;
          }

          .message-list::-webkit-scrollbar-thumb {
            background:#edeeee !important;
            border-radius: 5px;
          }

          .message-send-btn {
            background: url('/static/img/messages-send-blue.png');
            background-size: 23px 20px;
            background-position: 5px 2px;
            background-repeat: no-repeat;
            width: 30px;
            height: 25px;
            float: left;
            border-radius:3px;
          }

          .no-selected-chat {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            flex-grow: 1;
          }

          .chat-search {
            padding: 10px;
          }

          .chat-search > input {
            background: #F2F3F4;
            border-radius: 4px;
            border: none;
          }

          .chat-search > input::placeholder {
            text-align: center;
          }

          .chat-conversation {
            display: flex;
            cursor: pointer;
            padding: 5px 10px;
          }

          .current {
            color: #fff;
            background: #0064FF;
          }

          .chat-conversation:hover {
            color: #fff;
            background: #0064FF;
          }

          .chat-conversation:hover .unread-count {
            color: #0064FF;
            background: #fff;
          }

          .chat-conversation:hover .chat-last-message {
            color: #8BB9FB;
          }

          .chat-avatar {
            width: 45px;
            height: 45px;
            border-radius: 50%;
          }

          .chat-conversation-detail {
            flex-grow: 1;
            padding: 0 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
          }

          .chat-name {
            font-size: 13px;
            font-weight: bold;
            height: 19px;
            overflow: hidden;
            line-height: 160%;
          }

          .unread-count {
            color: #fff;
            padding: 2px 6px;
            height: 100%;
            background: #0064FF;
            font-weight: bold;
            font-size: 13px;
            border-radius: 50px;
            margin-top:7px;
          }

          .chat-last-message {
            color: #a1a1a1;
            font-size: 12px;
            margin-top:-10px;
          }

          .chat-last-message-author {
            font-weight: bold;
          }

          .message {
            background: #EDEFEF;
            margin-bottom: 10px;
            padding: 10px;
            font-size: 14px;
            line-height: 21px;
            border-radius: 5px;
            align-self: flex-start;
          }

          .message > div {
            display: inline-block;
          }

          .me {
            background: #0064FF;
            color: #fff;
            align-self: flex-end;
          }

          .message-form {
            border-top: 1px solid #E6E8E9;
            padding: 10px;
            display: flex;
            align-items: center;
          }

          .message-form > input {
            font-size: 14px;
            padding: 10px;
            border-radius: 3px;
            margin-right: 3px;
          }

          .message-form > button {
            cursor: pointer;
            padding: 7px;
            border-radius:3px;
          }

          .message__invite-title {
            color: #A6A6A6;
            padding: 10px;
            text-align: center;
            font-weight: bold;
          }

          .message__invite-accept {
            padding: 7px 10px;
            color: #fff;
            background: #a6da41;
            border-radius: 3px;
            font-weight: 700;
            float: left;
            cursor: pointer;
            margin-left: 70px;
            margin-right: 10px;
          }

          .message__invite-decline {
            padding: 7px 10px;
            color: #1d1d1d;
            background: #edeeee;
            border-radius: 3px;
            float: left;
            cursor: pointer;
          }

          .message-form > button:hover {
            background: #f5f7fa;
          }
        `}</style>
      </div>
    )
  }
}

export default clickOutside(Chat)

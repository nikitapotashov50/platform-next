import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import clickOutside from 'react-click-outside'
import classNames from 'classnames'
import PaperPlaneIcon from 'react-icons/lib/fa/paper-plane'
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
  }

  handleClickOutside () {
    this.props.handleClickOutside()
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
    const node = findDOMNode(this.messagesEnd)
    node && node.scrollIntoView()
  }

  render () {
    const you = { radarId: 1 } // your radar id

    if (!this.props.auth) {
      return (
        <ChatWindow>
          <div style={{ padding: '10px' }}>
            <ChatLoginForm
              submit={this.props.login}
              onSuccess={() => {
                this.props.getChatList()
              }}
              onError={() => {
                console.log('error')
              }} />
          </div>
        </ChatWindow>
      )
    }

    return (
      <div className='chat-container'>

        <div className='chat-list'>
          <div className='chat-search'>
            <input type='text' placeholder='Поиск' />
          </div>

          <div>
            {this.props.chats.map(chat => (
              <div key={chat.chatId} className={classNames('chat-conversation', {
                current: this.props.currentChat === chat.chatId
              })} onClick={() => {
                this.props.onSelect(chat.chatId, () => this.scrollToEnd())
              }}>

                <div>
                  <img className='chat-avatar' src={chat.avatar} />
                </div>
                <div className='chat-conversation-detail'>
                  <div className='chat-name'>
                    {chat.chatName}
                  </div>
                  <div className='chat-last-message'>
                    {chat.lastMessage.userId === you.radarId && (
                      <span><span className='chat-last-message-author'>
                        {you.first_name}
                      </span>: </span>
                    )}
                    {chat.lastMessage.text.substring(0, 25) + '...'}
                  </div>
                </div>
                <div className='unread-count'>
                  {chat.unreadMessageCount}
                </div>

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
            <div className='message-list'>
              {this.getMessages().map(message => (
                <Message {...message} isGroup={this.getCurrentChat().isGroup} />
              ))}
            </div>

            <div className='message-form'>
              <input
                type='text'
                placeholder='Написать сообщение'
                value={this.state.newMessageText}
                onChange={e => {
                  this.setState({
                    newMessageText: e.target.value
                  })
                }} />
              <button onClick={() => {
                if (!this.state.newMessageText) return
                this.props.sendMessage(
                  this.props.currentChat,
                  this.state.newMessageText
                )
                this.scrollToEnd()
                this.setState({
                  newMessageText: ''
                })
              }}>
                <PaperPlaneIcon color='#0064FF' size='24' />
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
            top: 65px;
            box-sizing: border-box;
            right: 220px;
            border-radius: 3px;
            border: 1px solid #e1e3e4;
            box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
            max-height: 500px;
            overflow: auto;
          }

          .chat-list {
            width: 260px;
            min-width: 260px;
            max-width: 260px;
            border-right: 1px solid #E6E8E9;
          }

          .message-list {
            flex-grow: 1;
            padding: 10px;
            display: flex;
            flex-direction: column;
            max-height: 350px;
            overflow: auto;
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
            padding: 10px;
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
            width: 50px;
            height: 50px;
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
            font-size: 14px;
            font-weight: bold;
          }

          .unread-count {
            color: #fff;
            padding: 2px 10px;
            height: 100%;
            background: #0064FF;
            font-weight: bold;
            font-size: 14px;
            border-radius: 50px;
          }

          .chat-last-message {
            color: #A6A6A6;
          }

          .chat-last-message-author {
            font-weight: bold;
          }

          .message {
            background: #EDEFEF;
            margin-bottom: 10px;
            padding: 10px;
            font-size: 14px;
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
            margin-right: 10px;
          }

          .message-form > button {
            cursor: pointer;
            padding: 7px;
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

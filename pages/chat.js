import React, { Component } from 'react'
import axios from 'axios'
import Router from 'next/router'
import { bindActionCreators } from 'redux'

import isLogged from '../client/components/Access/isLogged'

import DefaultLayout from '../client/layouts/default'
import PageHoc from '../client/hocs/Page'
import { notify, getChatList, getMessageList } from '../client/redux/chat'
import ChatList from '../client/components/Chat/List'
import MessageList from '../client/components/Chat/MessageList'

class ChatPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      chats: [],
      messages: [],
      choosenChat: null
    }

    this.fetchMessages = this.fetchMessages.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
  }

  async componentDidMount () {
    this.props.notify() // subscribe to new messages
    // this.props.dispatch(notify()) // subscribe to new messages
    this.props.getChatList()

    // await axios(`${BACKEND_URL}/api/chat/login`)
    // const { data } = await axios(`${BACKEND_URL}/api/chat/list`, {
    //   withCredentials: true
    // })
    // this.setState({
    //   chats: data.chats
    // })

    // if (this.props.url.query.id) {
    //   const messages = await this.fetchMessages(this.props.url.query.id)
    //   this.setState({
    //     messages
    //   })
    // }
  }

  // async componentWillReceiveProps (nextProps) {
  //   if (nextProps.url.query.id) {
  //     const messages = await this.fetchMessages(nextProps.url.query.id)
  //     this.setState({
  //       messages
  //     })
  //   }
  // }

  async fetchMessages (chatId, lastMessageId) {
    const { data } = await axios(`${BACKEND_URL}/api/chat/${chatId}/message?lastMessageId=${lastMessageId}`, {
      withCredentials: true
    })
    return data.messages
  }

  async sendMessage (text) {
    const chatId = this.props.url.query.id
    await axios.post(`${BACKEND_URL}/api/chat/${chatId}/message`, {
      text
    }, {
      withCredentials: true
    })
  }

  render () {
    return (
      <DefaultLayout>
        <div className='chat-container'>
          <div className='left-side'>
            <ChatList
              chats={this.props.chats}
              onSelect={async chatId => {
                console.log('chat id', chatId)
                this.setState({
                  choosenChat: chatId
                })
                const messages = await this.fetchMessages(chatId)
                this.setState({
                  messages
                })
                Router.push(`/chat?id=${chatId}`, `/chat/${chatId}`)
              }} />
          </div>
          <div className='right-side'>
            {this.state.choosenChat ? (
              <MessageList
                messages={this.state.messages}
                sendMessage={this.sendMessage} />
                // loadMore={async (lastMessageId) => {
                //   const chatId = this.state.choosenChat
                //   const messages = await this.fetchMessages(chatId, lastMessageId)
                //   this.setState({
                //     messages: [...messages, ...this.state.messages]
                //   })
                // }} />
            ) : (
              <div className='choose-chat'>Выберите чат</div>
            )}
            {/* <MessageList
              messages={this.state.messages}
              sendMessage={this.sendMessage}
              loadMore={async (lastMessageId) => {
                const chatId = this.props.url.query.id
                const messages = await this.fetchMessages(chatId, lastMessageId)
                this.setState({
                  messages: [...messages, ...this.state.messages]
                })
              }} /> */}
          </div>

          <style jsx>{`
            .chat-container {
              background: #fff;
              display: flex;
            }

            .left-side {
              min-width: 35%;
              max-width: 35%;
              border-right: 1px solid #ccc;
            }

            .right-side {
              flex-grow: 1;
              padding: 10px;
            }

            .choose-chat {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100%;
            }
          `}</style>
        </div>
      </DefaultLayout>
    )
  }
}

export default PageHoc(isLogged(ChatPage), {
  title: 'Чаты',
  mapStateToProps: state => ({
    chats: state.chat.chats
  }),
  mapDispatchToProps: dispatch => bindActionCreators({
    notify,
    getChatList,
    getMessageList
  }, dispatch)
})

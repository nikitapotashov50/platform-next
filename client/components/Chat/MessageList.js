import React, { Component } from 'react'
// import Waypoint from 'react-waypoint'
import Message from './Message'

class MessageList extends Component {
  render () {
    const { messages, sendMessage } = this.props

    return (
      <div style={{ height: '400px', overflow: 'auto' }}>
        {/* <Waypoint onEnter={() => {
          console.log('toppest message', messages[0])
          this.props.loadMore(messages[0].messageId)
        }} /> */}

        {messages.map(message => (
          <Message key={message.messageId} {...message} />
        ))}

        <div>
          <input type='text' placeholder='Напишите сообщение...' onKeyPress={e => {
            if (e.key === 'Enter') {
              sendMessage(e.target.value)
              e.target.value = ''
            }
          }} />
        </div>
      </div>
    )
  }
}

export default MessageList
//
// export default ({ messages, sendMessage }) => (
//   <div style={{ height: '400px', overflow: 'auto' }} onScroll={() => {
//     const [firstVisibleIndex, lastVisibleIndex] = this.list.getVisibleRange()
//     if (lastVisibleIndex >= theIndexIWantToLoadMoreAt) loadMore()
//   }}>
//     <ReactList
//       length={messages.length}
//       itemRenderer={(index, key) => <Message key={key} {...messages[index]} />}
//       initialIndex={9}
//       ref={c => { this.list = c }} />
//     {/* {messages.map(message => (
//       <Message key={message.messageId} {...message} />
//     ))} */}
//
//     <div>
//       <input type='text' placeholder='Напишите сообщение...' onKeyPress={e => {
//         if (e.key === 'Enter') {
//           sendMessage(e.target.value)
//           e.target.value = ''
//         }
//       }} />
//     </div>
//   </div>
// )

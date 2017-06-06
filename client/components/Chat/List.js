export default ({ chats = [], onSelect }) => (
  <div>
    {chats.map(({ chatId, chatName, avatar, lastMessage }) => (
      <div className='chat' key={chatId} onClick={() => onSelect(chatId)}>
        <div className='chat-left-column'>
          <div className='chat-avatar'><img src={avatar} /></div>
        </div>
        <div className='chat-right-column'>
          <div className='chat-name'>{chatName}</div>
          <div className='chat-last-message'>
            <span className='chat-last-message-author'>{lastMessage.userName}:</span> {lastMessage.text.substring(0, 25) + '...'}
          </div>
        </div>
      </div>
    ))}

    <style jsx>{`
      .chat {
        background: #fff;
        padding: 10px;
        margin: 10px;
        display: flex;
        cursor: pointer;
      }

      .chat:hover {
        background: #f5f7fa;
      }

      .chat-right-column {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }

      .chat-name {
        font-size: 16px;
        font-weight: bold;
      }

      .chat-last-message-author {
        color: #a1a9b7;
      }

      .chat-avatar img {
        border-radius: 50%;
        width: 50px;
        height: 50px;
      }
    `}</style>
  </div>
)

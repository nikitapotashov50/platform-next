const ChatButton = ({ handleClick, notificationCount = 0 }) => (
  <div className='chat-button' onClick={handleClick}>
    {notificationCount > 0 && (
      <div className='chat-icon'>
        <div className='chat-button-label'>{notificationCount}</div>
      </div>
      )}

    {notificationCount === 0 && (
      <div className='chat-icon-disabled'>
        <div className='chat-button-label-disabled'>0</div>
      </div>
      )}

    <style jsx>{`
      .chat-icon {
        background-image: url('/static/img/messages-ico.png');
        background-size: 102px 16px;
        background-position: -65px 22px;
        padding: 0 17px;
        height: 60px;
        background-repeat: no-repeat;
        float: left;
      }

      .chat-icon-disabled {
        background-image: url('/static/img/messages-ico.png');
        background-size: 102px 16px;
        background-position: 14px 22px;
        padding: 0 17px;
        height: 60px;
        background-repeat: no-repeat;
        float: left;
      }
      .chat-button {
        position: relative;
      }


      .chat-button-label {
        float: left;
        margin-left: 27px;
        font-size: 14px;
        color: #196aff;
      }
      .chat-button-label-disabled {
        float: left;
        margin-left: 27px;
        font-size: 14px;
        color: #9da5ab;
      }
    `}</style>
  </div>
)

export default ChatButton

import MailIcon from 'react-icons/lib/fa/envelope-o'

const ChatButton = ({ handleClick, notificationCount = 0 }) => (
  <div className='chat-button' onClick={handleClick}>
    {notificationCount > 0 && (
      <div className='chat-button-label'>{notificationCount}</div>
    )}

    <MailIcon size={26} />

    <style jsx>{`
      .chat-button {
        position: relative;
      }

      .chat-button-label {
        position: absolute;
        top: 13px;
        right: -5px;
        background: #0c00ff;
        padding: 3px;
        color: white;
        height: 10px;
        width: 10px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `}</style>
  </div>
)

export default ChatButton

import moment from 'moment'
import classNames from 'classnames'

const Message = ({ isGroup, messageId, avatar, userName, userId, date, text, isSpecial, you }) => {
  if (isSpecial) {
    return ( // служебное сообщение
      <div key={messageId} className='special'>
        {text}

        <style jsx>{`
          .special {
            background: none;
            align-self: center;
            color: #A6A6A6;
            font-weight: bold;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div key={messageId} className={classNames({ me: you && you.radar_id === userId })}>
      {isGroup ? ( // сообщение в групповом чате
        <div className='group'>
          <div className='group-left'>
            <img src={avatar} className='avatar' />
          </div>
          <div className='group-right message'>
            <div className='group-header'>
              <div className='group-username'>{userName}</div>
              <div className='time'>{moment.unix(date).format('HH:mm')}</div>
            </div>
            <div className='text'>{text}</div>
          </div>
        </div>
      ) : ( // сообщение в одиночном чате
        <div className='message text'>{text}</div>
      )}

      <style jsx>{`
        .message {
          background: #EDEFEF;
          margin-bottom: 10px;
          padding: 10px;
          font-size: 14px;
          border-radius: 5px;
          align-self: flex-start;
          display: inline-block;
        }

        .avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .group {
          display: flex;
          align-items: flex-start;
        }

        .group-right {
          margin-left: 10px;
        }

        .group-username {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .group-header {
          display: flex;
          justify-content: space-between;
        }

        .time {
          margin-left: 10px;
          color: #A6A6A6;
        }

        .me {
          align-self: flex-end;
        }

        .me > .text {
          background: #0064FF;
          color: #fff;
        }
      `}</style>
    </div>
  )
}

export default Message

let users = [
  { first_name: 'Петр', last_name: 'Осипов', id: 123, message: 'Супер!' },
  { first_name: 'Петр', last_name: 'Осипов', id: 32, message: 'Супер!' },
  { first_name: 'Петр', last_name: 'Осипов', id: 1233, message: 'Супер!' }
]

export default props => (
  <div className='chat-window'>
    <div className='chat-window__block chat-window__block_list'>

      <ul className='chat-users'>
        { users.map(el => (
          <li className='chat-users__item'>
            <div className='chat-user-preview'>
              <img className='chat-user-preview__image' src='/static/img/user.png' />
              <div className='chat-user-preview__name'>{el.first_name} {el.last_name}</div>
              <div className='chat-user-preview__message'>{el.message}</div>
            </div>
          </li>
        ))}
      </ul>

    </div>
    <div className='chat-window__block chat-window__block_messages'>
      123
    </div>

    <style jsx>{`
      .chat-window {
        top: 70px;
        right: 10%;
        position: fixed;

        width: 750px;
        height: 200px;
        display: flex;

        background: #fff;
        box-shadow: 1px 1px 5px 3px color(color(#ebebeb b(+20%)) a(.4));
      }

      .chat-window__block {
        display: inline-block;
      }

      .chat-window__block_list {
        width: 300px;
        border-right: 1px solid #ebebeb;
      }
      .chat-window__block_messages {
        width: 450px;
      }

      .chat-users {}
      .chat-users__item {
        padding: 5px 15px;
      }
      .chat-users__item:hover { background: #196aff; }

      .chat-user-preview {
        position: relative;

        height: 50px;
        padding-left: 60px;
      }
      .chat-user-preview__image {
        top: 0;
        left: 0;
        position: absolute;

        width: 50px;
        height: 50px;
      }
      .chat-user-preview__name {
        padding-top: 2px;
        line-height: 26px;

        color: #000;
        font-size: 14px;
        font-weight: 700;
      }
      .chat-user-preview__message {
        color: #a1a1a1;
        font-size: 12px;
        font-weight: 500;
      }
    `}</style>
  </div>
)

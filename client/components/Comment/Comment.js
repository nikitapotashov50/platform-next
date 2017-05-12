import TimeAgo from '../TimeAgo'

const Comment = ({ user, content, created_at }) => (
  <div className='comment-container'>
    <div className='comment-author-photo'>
      <img style={{ width: '40px', borderRadius: '50%' }} src={user.picture_small} />
    </div>

    <div className='lol'>
      <div className='comment-author-name'>
        {user.first_name} {user.last_name}
      </div>

      <div className='comment-content'>
        {content}
      </div>

      <div className='comment-footer'>
        <div>
          {/* eslint-disable camelcase */}
          <div className='comment-date'>
            <TimeAgo date={created_at} />
          </div>
          {/* eslint-enable camelcase */}
        </div>
      </div>
    </div>

    <style jsx>{`
      .comment-container {
        padding: 5px;
        border-top: 1px solid #efeff0;
        display: flex;
      }

      .comment-author-photo {
        margin-right: 10px;
      }

      .lol {
        flex-grow: 1;
      }

      .comment-author-name {
        font-weight: bold;
        margin-bottom: 5px;
      }

      .comment-footer {
        margin-top: 10px;
        display: flex;
        font-size: 12px;
      }

      .comment-date {
        color: #9da5ab;
      }
    `}</style>
  </div>
)

export default Comment

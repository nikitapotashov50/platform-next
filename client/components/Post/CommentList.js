import Link from 'next/link'
import Img from 'react-image'

export default ({ comments }) => (
  <div>
    {comments.map(({ id, user, content }) => (
      <div className='post-comment-container' key={id}>

        <div className='user-info'>
          <div className='user-photo-container'>
            <Link href={`/@${user.name}`}>
              <Img
                src={[
                  user.picture_small,
                  '/static/img/user.png'
                ]}
                alt={`${user.first_name} ${user.last_name}`}
                style={{
                  width: '30px',
                  borderRadius: '50%',
                  marginRight: '10px'
                }} />
            </Link>
          </div>

          <div>
            <Link href={`/@${user.name}`}>
              <a className='user-name'>{user.first_name} {user.last_name}</a>
            </Link>
          </div>
        </div>

        <div>{content}</div>

        <style jsx>{`
          .post-comment-container {
            margin-bottom: 10px;
          }

          .user-info {
            display: flex;
            align-items: flex-start;
            max-width: 390px;
            margin-bottom: 15px;
          }

          .user-name {
            color: #1f1f1f;
            font-weight: 700;
            font-size: 14px;
          }

          .user-photo-container {
            cursor: pointer;
          }
        `}</style>
      </div>
    ))}
  </div>
)

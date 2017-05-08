import Link from 'next/link'
import Img from 'react-image'
import TextWithImages from './TextWithImages'

const Post = ({ id, title, content, user }) => (
  <div className='post'>

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
              width: '50px',
              borderRadius: '50%',
              marginRight: '10px'
            }} />
        </Link>
      </div>

      <div>
        <Link href={`/@${user.name}`}>
          <a className='user-name'>{user.first_name} {user.last_name}</a>
        </Link>
        <div className='user-occupation'>Монтаж охранно-пожарных систем, видеонаблюдения, контроля доступом, локальные сети, автоматизация, продажа оборудования, проектирование и техническое обслуживание систем безопасности.</div>
      </div>
    </div>

    <h1 className='post-title'>{title}</h1>

    <TextWithImages text={content} />

    <style jsx>{`
      .post {
        padding: 15px;
        margin: 0 0 15px;
        background: #fff;
        border: 1px solid #e1e3e4;
        border-radius: 3px;
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

      .user-occupation {
        font-size: 12px;
        color: #7d7d7d;
        margin-top: 4px;
      }

      .user-photo-container {
        cursor: pointer;
      }

      .post-title {
        font-family: museo_sans_cyrl,Helvetica,Arial,sans-serif;
        font-weight: 700;
        font-size: 14px;
        margin: 0 0 5px;
      }
    `}</style>
  </div>
)

export default Post

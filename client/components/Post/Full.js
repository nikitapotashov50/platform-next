import moment from 'moment'
import Link from 'next/link'
import { connect } from 'react-redux'

import PostSummary from './Summary'
import TextWithImages from './TextWithImages'
import CommentsList from '../Comment/CommentList'

const FullPost = ({ title, comments, content, attachments, user, created_at, isLogged, ...props }) => (
  <div>
    <div className='post-full'>

      <div className='post-full__header'>
        <h1 className='post-full__title'>{title}</h1>

        { user && (
          <Link href={'/user?username=' + user.name} as={`/@${user.name}`}>
            <a className='post-full__header-info post-full__header-info_link'>{`${user.first_name} ${user.last_name}`}</a>
          </Link>
        )}

        <span className='post-full__header-info post-full__header-info_time'>{moment(created_at).from(moment())}</span>
      </div>

      <div className='post-full__content'>
        <TextWithImages text={content} />
        <div>
          {attachments && attachments.map(({ id, path }) => (
            <img key={id} src={path} style={{ maxWidth: '100%', marginBottom: '15px' }} />
          ))}
        </div>
      </div>

      <div className='post-full__footer'>
        <PostSummary isLogged={isLogged} likes={props.likes_count} comments={props.comments_count} />
      </div>
    </div>

    { (comments && comments.length !== 0) && (
      <div className='comments'>
        <CommentsList comments={comments} full />
      </div>
    )}
  </div>
)

const mapStateToProps = ({ auth }) => ({
  isLogged: auth.isLogged
})

export default connect(mapStateToProps)(FullPost)

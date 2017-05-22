import moment from 'moment'
import Link from 'next/link'

import Attachments from './Attachments'
import PostSummary from './Summary'
import TextWithImages from './TextWithImages'
import CommentsList from '../Comment/List'

export default ({ id, title, attachments = [], comments, content, user, loggedUser, created_at, isLiked = false, ...props }) => {
  return (
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

          { (attachments.length > 0) && <Attachments items={attachments} />}
        </div>

        <div className='post-full__footer'>
          <PostSummary
            onLike={props.onLike}
            isLogged={!!loggedUser}
            likes={props.likes_count}
          />
        </div>
      </div>

      { (comments.length !== 0) && (
        <div className='comments'>
          <CommentsList ids={comments} postId={id} expanded />
        </div>
      )}
    </div>
  )
}

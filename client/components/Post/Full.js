import moment from 'moment'
import Link from 'next/link'

import PostSummary from './Summary'
import TextWithImages from './TextWithImages'
import CommentsList from '../Comment/CommentList'

export default ({ title, comments, content, user, created_at }) => (
  <div>
    <div className='post-full'>

      <div className='post-full__header'>
        <h1 className='post-full__title'>{title}</h1>
        {/* Это коннечно маловероятно, но вдруг */}
        { user && (
          <Link href={'/user?username=' + user.name} as={`/@${user.name}`}>
            <a className='post-full__header-info post-full__header-info_link'>{`${user.first_name} ${user.last_name}`}</a>
          </Link>
        )}
        <span className='post-full__header-info post-full__header-info_time'>{moment(created_at).from(moment())}</span>
      </div>

      <div className='post-full__content'>
        <TextWithImages text={content} />
      </div>

      <div className='post-full__footer'>
        <PostSummary />
      </div>
    </div>

    { (comments.length !== 0) && (
      <div className='comments'>
        <CommentsList comments={comments} full />
      </div>
    )}
  </div>
)

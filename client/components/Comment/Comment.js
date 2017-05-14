import UserInline from '../User/Inline'

const Comment = ({ user, content, likes = 0, ...props }) => (
  <div className='comment'>
    <div className='comment__header'>
      <UserInline small user={user} date={props.created_at} />
    </div>

    <div className='comment__body'>
      {content}
    </div>

    <div className='comment__footer'>
      <div className='post-summary'>
        <div className='post-summary__block_left'>
          <a className='post-summary__info post-summary__info_icon post-summary__info_icon_like' data-prefix='Нравится: '>{likes}</a>
        </div>
      </div>
    </div>
  </div>
)

export default Comment

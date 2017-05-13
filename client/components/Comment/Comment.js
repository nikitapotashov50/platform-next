import UserInline from '../User/Inline'

const Comment = ({ user, content, ...props }) => (
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
          <a className='post-summary__info post-summary__info_icon post-summary__info_icon_like' data-prefix='Нравится: '>1</a>
        </div>
        <div className='post-summary__block_right' />
      </div>
    </div>
  </div>
)

export default Comment

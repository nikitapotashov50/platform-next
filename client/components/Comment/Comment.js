import UserInline from '../User/Inline'
import CloseIcon from 'react-icons/lib/fa/close'

const Comment = ({ user, currentUser, content, remove, ...props }) => (
  <div className='comment'>
    <div className='comment__header'>
      { (user.id === currentUser) && (
        <span className='comment__remove' onClick={remove}><CloseIcon color='#dadee1' size={12} /></span>
      )}

      <UserInline small user={user} date={props.created_at} noOccupation />
    </div>

    <div className='comment__body'>
      {content}
    </div>

    {/* <div className='comment__footer'>
      <div className='post-summary'>
        <div className='post-summary__block_left'>
          <a className='post-summary__info post-summary__info_icon post-summary__info_icon_like' data-prefix='Нравится: '>{likes}</a>
        </div>
      </div>
    </div> */}
  </div>
)

export default Comment

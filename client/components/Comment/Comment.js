import UserInline from '../User/Inline'
import CloseIcon from 'react-icons/lib/fa/close'

const Comment = ({ user = {}, currentUser, content, remove, ...props }) => (
  <div className='comment'>
    <div className='comment__header'>
      { (user._id === currentUser) && (
        <span className='comment__remove' onClick={remove}><CloseIcon color='#dadee1' size={12} /></span>
      )}

      <UserInline small user={user} date={props.created_at} noOccupation />
    </div>

    <div className='comment__body'>{content}</div>
  </div>
)

export default Comment

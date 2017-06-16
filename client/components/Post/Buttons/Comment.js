import Icon from 'react-icons/lib/fa/comment'

export default ({ handleClick }) => (
  <div className='post-interact-btn' onClick={handleClick}>
    <Icon className='post-interact-btn__icon' color='#dadee1' size={20} />
    <div className='post-interact-btn__text'>Комментировать</div>
  </div>
)

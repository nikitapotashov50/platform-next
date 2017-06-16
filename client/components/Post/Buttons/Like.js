import HeartIcon from 'react-icons/lib/fa/heart'

export default ({ count, handleClick, liked, fakeLike = false }) => (
  <div className='post-interact-btn' onClick={handleClick}>
    <HeartIcon className='post-interact-btn__icon' color={liked ? '#0c00ff' : '#dadee1'} size={20} />
    <div className='post-interact-btn__text'>Нравится { !!count && count}</div>
  </div>
)

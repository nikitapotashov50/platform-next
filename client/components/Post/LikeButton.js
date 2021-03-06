import HeartIcon from 'react-icons/lib/fa/heart'

export default ({ count, handleClick, liked, fakeLike = false }) => (
  <div className='like-button' onClick={handleClick}>
    <HeartIcon color={liked ? '#0c00ff' : '#dadee1'} size={20} />
    <div className='like-button-text'>Нравится { !!count && count}</div>

    <style jsx>{`
      .like-button {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        color: #9da5ab;
        padding: 5px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        user-select: none;
        margin-right: 10px;
      }

      .like-button:hover {
        background: #f5f7fa;
      }

      .like-button-text {
        margin-left: 5px;
      }
    `}</style>
  </div>
)

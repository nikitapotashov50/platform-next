import CommentIcon from 'react-icons/lib/fa/comment'

export default ({ handleClick, count }) => (
  <div className='comment-button' onClick={handleClick}>
    <CommentIcon color='#dadee1' size={20} />
    <div className='comment-button-text'>Комментировать: {count}</div>

    <style jsx>{`
      .comment-button {
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
      }

      .comment-button:hover {
        background: #f5f7fa;
      }

      .comment-button-text {
        margin-left: 5px;
      }
    `}</style>
  </div>
)

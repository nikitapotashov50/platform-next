export default ({ onLike, onComment, withShare, likes = 0 }) => (
  <div className='post-summary'>
    <div className='post-summary__block_left'>
      <a className='post-summary__info post-summary__info_icon post-summary__info_icon_like' onClick={onLike} data-prefix='Нравится: ' href='#'>{likes}</a>
      <a className='post-summary__info post-summary__info_icon post-summary__info_icon_comment' onClick={onComment}>Комментировать</a>
    </div>
    { withShare && (
      <div className='post-summary__block_right'>
        <div className='post-summary__info' />
      </div>
    ) }
  </div>
)

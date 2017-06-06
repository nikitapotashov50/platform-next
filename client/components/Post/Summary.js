import LikeButton from './LikeButton'
import CommentButton from './CommentButton'

export default ({ isLogged, onLike, onComment, withShare, likes = 0, liked = false }) => {
  const onLikeClicked = e => {
    e.preventDefault()
    if (!isLogged) return
    onLike()
  }

  return (
    <div className='post-summary'>
      <div className='post-summary__block_left'>
        <LikeButton count={likes} handleClick={onLikeClicked} liked={liked} />
        {isLogged && <CommentButton handleClick={onComment} />}
      </div>

      { withShare && (
        <div className='post-summary__block_right'>
          { isLogged && <a className='post-summary__link' href='#'>Ответить</a> }
          <div className='share'>
            <div className='share__label'>Поделиться: </div>
            <a className='share__icon share__icon_vk' href='#' />
            <a className='share__icon share__icon_facebook' href='#' />
            <a className='share__icon share__icon_twitter' href='#' />
          </div>
        </div>
      ) }

      <style jsx>{`
        .post-summary__block_left {
          float: none;
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  )
}

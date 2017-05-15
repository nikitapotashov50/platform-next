import { size } from 'lodash'
import LikeButton from './LikeButton'
import CommentButton from './CommentButton'

export default ({ isLogged, onLike, onComment, withShare, likes = 0 }) => {
  const onLikeClicked = e => {
    e.preventDefault()
    if (!isLogged) return
    onLike()
  }

  return (
    <div className='post-summary'>
      <div className='post-summary__block_left'>
        <LikeButton
          count={size(likes) > 0 && size(likes)}
          handleClick={onLikeClicked}
         />
        {isLogged && <CommentButton handleClick={onComment} />}
        {/* <a className='post-summary__info post-summary__info_icon post-summary__info_icon_like' onClick={onLikeClicked} data-prefix='Нравится: ' href='#'>{likes}</a> */}
        {/* { isLogged && <a className='post-summary__info post-summary__info_icon post-summary__info_icon_comment' onClick={onComment}>Комментировать</a> } */}
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
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  )
}

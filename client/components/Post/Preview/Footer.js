import PostSummary from '../Summary'

export default ({ isLiked, onLike, likes, onComment, loggedUser, pinned = false, votable = false }) => (
  <PostSummary liked={isLiked} onLike={onLike} likes={likes + Number(isLiked)} onComment={onComment} isLogged={loggedUser} votable={votable} pinned={pinned} />
)

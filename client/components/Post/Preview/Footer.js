import PostSummary from '../Summary'

export default ({ isLiked, onLike, likes, onComment, loggedUser }) => (
  <PostSummary liked={isLiked} onLike={onLike} likes={likes + Number(isLiked)} onComment={onComment} isLogged={loggedUser} />
)

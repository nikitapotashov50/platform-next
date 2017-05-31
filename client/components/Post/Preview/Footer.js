import PostSummary from '../Summary'
import Comments from '../../Comment/List'

export default ({ comments, _id, showCommentForm, isLiked, onLike, onComment, loggedUser, likes }) => (
  <div>
    <PostSummary liked={isLiked} onLike={onLike} isLogged={!!loggedUser} likes={likes + Number(isLiked)} onComment={onComment} />
    <Comments ids={comments} postId={_id} expanded={showCommentForm} />
  </div>
)

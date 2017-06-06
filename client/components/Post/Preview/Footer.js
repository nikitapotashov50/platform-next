import PostSummary from '../Summary'
<<<<<<< HEAD
// import Comments from '../../Comment/List'

export default ({ isLiked, onLike, likes, onComment, loggedUser }) => (
  // comments, _id, showCommentForm, isLiked, onLike, onComment, loggedUser, likes
  <PostSummary liked={isLiked} onLike={onLike} likes={likes + Number(isLiked)} onComment={onComment} isLogged={loggedUser} />
)
// <Comments ids={post.comments} postId={post._id} expanded={showForm} />
=======
import Comments from '../../Comment/List'

export default ({ comments, _id, showCommentForm, isLiked, onLike, onComment, loggedUser, likes }) => (
  <div>
    <PostSummary liked={isLiked} onLike={onLike} isLogged={!!loggedUser} likes={likes + Number(isLiked)} onComment={onComment} />
    <Comments ids={comments} postId={_id} expanded={showCommentForm} />
  </div>
)
>>>>>>> 4be3b2a01a129e6a936ce5befb5943ae3fb39761

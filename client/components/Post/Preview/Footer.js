import PostSummary from '../Summary'
// import Comments from '../../Comment/List'

export default ({ isLiked, onLike, likes, onComment, loggedUser }) => (
  // comments, _id, showCommentForm, isLiked, onLike, onComment, loggedUser, likes
  <PostSummary liked={isLiked} onLike={onLike} likes={likes + Number(isLiked)} onComment={onComment} isLogged={loggedUser} />
)
// <Comments ids={post.comments} postId={post._id} expanded={showForm} />

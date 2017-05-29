import { addLike, removeLike } from '../../redux/likes'
import { fetchPosts, startListFetch, endListFetch, queryUpdate, deletePost } from '../../redux/posts'

export const getInitialProps = async (dispatch, params, serverPath) => {
  dispatch(startListFetch())
  await dispatch(queryUpdate(params, true))
  await dispatch(fetchPosts(params, serverPath, true))
  dispatch(endListFetch())

  return {}
}

export const mapStateToProps = ({ posts, users, likes, auth }) => ({
  ...posts.posts,
  users,
  likes: likes.posts || [],
  loggedUser: auth.user ? auth.user._id : null
})

export const mapDispatchToProps = dispatch => ({ dispatch })

export const mergeProps = (state, dispatchProps, props) => {
  const getPosts = async params => {
    dispatchProps.dispatch(startListFetch())
    await dispatchProps.dispatch(fetchPosts(params))
    dispatchProps.dispatch(endListFetch())
  }

  const updateParams = async (params, rewrite = false) => {
    await dispatchProps.dispatch(queryUpdate(params, rewrite))
    await getPosts({ ...(rewrite ? {} : state.query), ...params })
  }

  const toggleLike = postId => async () => {
    if (state.likes.indexOf(postId) > -1) await dispatchProps.dispatch(removeLike(postId))
    else await dispatchProps.dispatch(addLike(postId))
  }

  const removePost = postId => async () => {
    await dispatchProps.dispatch(deletePost(postId))
  }

  return {
    ...state,
    ...props,
    getPosts,
    toggleLike,
    updateParams,
    removePost
  }
}

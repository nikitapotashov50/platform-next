import { bindActionCreators } from 'redux'

import PageHoc from '../client/hocs/Page'
import ErrorLayout from '../client/layouts/error'
import FullPost from '../client/components/Post/Full'
import DefaultLayout from '../client/layouts/default'

import { loadMore } from '../client/redux/posts/comments'
import { addLike, removeLike } from '../client/redux/likes'
import { clearList, fetchPosts, endListFetch, startListFetch } from '../client/redux/posts/index'

const PostPage = ({ post, loggedUser, author, toggleLike, isLiked }) => {
  if (!post) return <ErrorLayout code={404} message={'Запрашиваемой вами страницы не существует'} />

  return (
    <DefaultLayout>
      <FullPost {...post} user={author} loggedUser={loggedUser} onLike={toggleLike} isLiked={isLiked} />
    </DefaultLayout>
  )
}

PostPage.getInitialProps = async ({ query, store, req }) => {
  let { user } = store.getState()
  let params = {
    by_post_id: query.postId,
    programId: user.programs.current || null
  }

  if (req) params.user = req.session.user ? req.session.user.id : null

  store.dispatch(clearList())
  store.dispatch(startListFetch())
  let { payload } = await store.dispatch(fetchPosts(params, BACKEND_URL))
  store.dispatch(endListFetch())

  let post = (payload.posts || [])[0]
  let author = post ? (payload.users[post.user_id] || null) : null

  if (post) await loadMore(post.comments.map(el => el.id))

  return { post, author }
}

const mapStateToProps = ({ likes, auth }) => ({
  likes: likes.posts || [],
  loggedUser: auth.user ? auth.user.id : null
})

const mapDispatchToProps = dispatch => bindActionCreators({
  addLike,
  removeLike
}, dispatch)

const mergeProps = (state, dispatch, props) => {
  if (!props.post) return { ...props, ...state }

  let postId = props.post.id

  const toggleLike = async () => {
    if (state.likes.indexOf(postId) > -1) await dispatch.removeLike(postId)
    else await dispatch.addLike(postId)
  }

  const isLiked = (state.likes || []).indexOf(postId) > -1

  return {
    ...state,
    ...props,
    isLiked,
    toggleLike
  }
}

export default PageHoc(PostPage, {
  title: 'Пост',
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
})

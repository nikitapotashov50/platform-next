import PageHoc from '../client/hocs/Page'
import FullPost from '../client/components/Post/Full'
import DefaultLayout from '../client/layouts/default'

import { fetchPosts, endListFetch, startListFetch } from '../client/redux/posts/index'

const PostPage = ({ post, comments }) => (
  <DefaultLayout>
    <FullPost {...post} />
    <br /><br /><br /><br />
  </DefaultLayout>
)

PostPage.getInitialProps = async ({ query, store, req }) => {
  let { user } = store.getState()
  let params = {
    by_post_id: query.postId,
    programId: user.programs.current || null
  }

  if (req) params.user = req.session.user ? req.session.user.id : null

  store.dispatch(startListFetch())
  await store.dispatch(fetchPosts(params, BACKEND_URL))
  store.dispatch(endListFetch())

  return {}
}

export default PageHoc(PostPage, {
  title: 'Пост',
  mapStateToProps: ({ posts, likes }) => ({ posts, likes })
})

import axios from 'axios'

import PageHoc from '../client/hocs/Page'
import FullPost from '../client/components/Post/Full'
import DefaultLayout from '../client/layouts/default'

const PostPage = ({ post, comments }) => (
  <DefaultLayout>
    <FullPost comments={comments} {...post} />
    <br /><br /><br /><br />
  </DefaultLayout>
)

PostPage.getInitialProps = async ({ query }) => {
  let { data } = await axios.get(`${BACKEND_URL}/api/post/${query.postId}`)
  return {
    post: data.post,
    comments: data.comments
  }
}

export default PageHoc(PostPage, {
  title: 'Пост'
})

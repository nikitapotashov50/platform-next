import Post from './Post'

const PostList = ({ posts }) => (
  <div>
    {posts.map(post => <Post key={post.id} {...post} />)}
  </div>
)

export default PostList

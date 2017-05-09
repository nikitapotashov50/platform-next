import Waypoint from 'react-waypoint'
import { connect } from 'react-redux'
import { loadMore } from '../../redux/store'
import Post from './Post'

let _offset = 20

const PostList = ({ posts, loadMore }) => (
  <div>
    {posts.map(post => <Post key={post.id} {...post} />)}
    <Waypoint onEnter={() => {
      loadMore(_offset)
      _offset = _offset * 2
    }} />
    <div>Загрузка</div>
  </div>
)

const mapDispatchToProps = dispatch => ({
  loadMore: offset => dispatch(loadMore(offset))
})

export default connect(null, mapDispatchToProps)(PostList)

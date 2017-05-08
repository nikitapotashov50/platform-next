// import axios from 'axios'
import React, { Component } from 'react'
import Post from './Post'

class PostList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      posts: [],
      fetching: true
    }
  }

  // async componentDidMount () {
  //   const { data } = await axios.get('/api/post')
  //   this.setState({
  //     posts: data,
  //     fetching: false
  //   })
  // }

  render () {
    // if (this.state.fetching) return <div>Загрузка</div>
    return (
      <div>
        {this.props.posts.map(post => <Post key={post.id} {...post} />)}
      </div>
    )
  }
}

export default PostList

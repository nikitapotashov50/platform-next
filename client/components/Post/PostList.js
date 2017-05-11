import React, { Component } from 'react'
import Waypoint from 'react-waypoint'
import { connect } from 'react-redux'
import { loadMore } from '../../redux/posts'
import Post from './Post'

class PostList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      offset: 20
    }
    this.scrollDownHandle = this.scrollDownHandle.bind(this)
  }

  scrollDownHandle () {
    this.props.loadMore(this.state.offset)
    this.setState({
      offset: this.state.offset * 2
    })
  }

  render () {
    const { posts } = this.props

    return (
      <div>
        {posts.map(post => <Post key={post.id} {...post} />)}
        <Waypoint onEnter={this.scrollDownHandle} />
        <div>Загрузка</div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  loadMore: offset => dispatch(loadMore(offset))
})

export default connect(null, mapDispatchToProps)(PostList)

import Router from 'next/router'
import { connect } from 'react-redux'
import Waypoint from 'react-waypoint'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'

import Post from './Post'
import { loadMore } from '../../redux/posts'

import PostFull from './Full'
import PostModal from './Modal'

class PostList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      offset: 20,
      expanded: null,
      expandedIndex: null
    }

    this.onPostExpand = this.onPostExpand.bind(this)
    this.onPostPaginate = this.onPostPaginate.bind(this)
    this.scrollDownHandle = this.scrollDownHandle.bind(this)
  }

  scrollDownHandle () {
    this.props.loadMore(this.state.offset)
    this.setState({
      offset: this.state.offset * 2
    })
  }

  onPostExpand (post, index) {
    return () => {
      let { pathname } = this.props
      Router.replace(pathname, post ? '/posts/' + post.id : pathname, { shallow: true })
      this.setState(state => {
        state.expanded = post
        state.expandedIndex = post ? index : null
      })
    }
  }

  onPostPaginate (direction) {
    let { expandedIndex } = this.state
    let nextIndex = expandedIndex + direction

    if (!this.props.posts[nextIndex]) return
    let { pathname } = this.props
    Router.replace(pathname, '/posts/' + this.props.posts[nextIndex].id, { shallow: true })
    this.setState(state => {
      state.expandedIndex = nextIndex
      state.expanded = this.props.posts[nextIndex]
    })
  }

  render () {
    const { posts } = this.props
    const { expanded } = this.state

    return (
      <div>
        {posts.map((post, index) => <Post key={post.id} {...post} onExpand={this.onPostExpand(post, index)} />)}
        <Waypoint onEnter={this.scrollDownHandle} />
        <div>Загрузка</div>

        {/* Модалка с постом */}
        <PostModal isOpened={!!expanded} onPaginate={this.onPostPaginate} onClose={this.onPostExpand(null)}>
          <PostFull {...expanded} />
        </PostModal>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  loadMore
}, dispatch)

export default connect(null, mapDispatchToProps)(PostList)

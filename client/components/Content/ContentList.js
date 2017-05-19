import Router from 'next/router'
import React, { Component } from 'react'

import Post from './Post'
import PostFull from './Full'
import PostModal from './Modal'

class ContentList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      offset: 20,
      expanded: null,
      expandedIndex: null
    }

    this.onPostExpand = this.onPostExpand.bind(this)
    this.onPostPaginate = this.onPostPaginate.bind(this)
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
    // console.log(posts)

    return (
      <div>
        {posts.map((post, index) => <Post key={post.id} {...post} onExpand={this.onPostExpand(post, index)} />)}

        {/* Модалка с постом */}
        <PostModal isOpened={!!expanded} onPaginate={this.onPostPaginate} onClose={this.onPostExpand(null)}>
          <PostFull {...expanded} />
        </PostModal>
      </div>
    )
  }
}

export default ContentList

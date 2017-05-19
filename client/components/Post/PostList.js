import Router from 'next/router'
import Waypoint from 'react-waypoint'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'

import Post from './Post'
import PostFull from './Full'
import PostModal from './Modal'

import { fetchPosts, clearPosts, startFetchPosts, getComments } from '../../redux/posts'

class PostList extends Component {
  static async getInitial (dispatch, serverPath, params) {
    dispatch(startFetchPosts())
    dispatch(clearPosts())
    await dispatch(fetchPosts(params, serverPath, true))

    return {}
  }

  constructor (props) {
    super(props)

    this.state = {
      expanded: null,
      expandedIndex: null
    }

    this.loadMore = this.loadMore.bind(this)
    this.onPostExpand = this.onPostExpand.bind(this)
    this.onPostPaginate = this.onPostPaginate.bind(this)
  }

  onPostExpand (post, index) {
    return () => {
      let { pathname } = this.props

      Router.replace(pathname.href, post ? '/posts/' + post.id : pathname.path, { shallow: true })

      this.setState(state => {
        state.expanded = post
        state.expandedIndex = post ? index : null
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    let flag = (nextProps.params.programId !== this.props.params.programId) || (nextProps.params.user !== this.props.params.user) || (nextProps.params.by_author_id !== this.props.params.by_author_id)
    if (flag) {
      this.props.clearPosts()
      this.props.startFetchPosts()
      this.props.fetchPosts({ ...nextProps.params, offset: 0 })
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

  async loadMore (e) {
    if (e && e.preventDefault) e.preventDefault()

    let { params } = this.props

    this.props.startFetchPosts()
    await this.props.fetchPosts({
      ...params,
      offset: this.props.offset + 1
    })
  }

  render () {
    const { posts = [], users = {}, fetching } = this.props
    const { expanded } = this.state

    let postCount = posts.length

    return (
      <div>
        { postCount > 0 && posts.map((post, index) => (
          <Post key={post.id} {...post} user={users[post.user_id]} onExpand={this.onPostExpand(post, index)} />
        ))}

        { postCount > 0 && (
          <a href='#' onClick={this.loadMore}>
            { fetching ? 'Загрука...' : 'Загрузить еще' }
            <Waypoint onEnter={this.loadMore} />
          </a>
        )}

        { (!postCount && fetching) && (
          <div>Загрузка</div>
        )}

        { (!postCount && !fetching) && (
          <div>Нет постов</div>
        )}

        {/* Модалка с постом */}
        { !!expanded && (
          <PostModal isOpened={!!expanded} onPaginate={this.onPostPaginate} onClose={this.onPostExpand(null)}>
            <PostFull {...expanded} user={users[expanded.user_id]} />
          </PostModal>
        )}
      </div>
    )
  }
}

const mapStateToProps = ({ posts }) => ({ ...posts })

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchPosts,
  getComments,
  clearPosts,
  startFetchPosts
}, dispatch)

const mergeProps = (state, dispatch, props) => {
  return {
    ...state,
    ...dispatch,
    ...props
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(PostList)

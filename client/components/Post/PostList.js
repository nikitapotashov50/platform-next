import Router from 'next/router'
import { isEqual } from 'lodash'
import Waypoint from 'react-waypoint'
import { connect } from 'react-redux'
import React, { Component } from 'react'

import Post from './Post'
import PostFull from './Full'
import PostModal from './Modal'

import { addLike, removeLike } from '../../redux/likes'
import { fetchPosts, startListFetch, endListFetch, queryUpdate, deletePost } from '../../redux/posts'

const isLiked = (likes, id) => (likes || []).indexOf(id) > -1

class PostList extends Component {
  static async getInitial (dispatch, params, serverPath) {
    dispatch(startListFetch())
    await dispatch(queryUpdate(params, true))
    await dispatch(fetchPosts(params, serverPath, true))
    dispatch(endListFetch())

    return {}
  }

  constructor (props) {
    super(props)

    this.state = { expanded: null, expandedIndex: null }

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

  /** заново забираем ифнормацию о постах при смене парметров запроса */
  async componentWillReceiveProps (nextProps) {
    if (!isEqual(nextProps.params, this.props.params)) {
      await this.props.updateParams(nextProps.params, true)
    }
  }

  // загружаем новую порцию постов, изменяя параметр offset
  async loadMore (e) {
    if (e && e.preventDefault) e.preventDefault()
    await this.props.updateParams({ offset: (this.props.query.offset || 0) + 1 })
  }

  render () {
    const { posts = [], users = {}, fetching, removePost, toggleLike, loggedUser, likes } = this.props
    const { expanded } = this.state

    let postCount = posts.length

    return (
      <div>
        { postCount > 0 && posts.map((post, index) => (
          <Post
            {...post}
            key={post.id}
            isLiked={isLiked(likes, post.id)}
            loggedUser={loggedUser}
            user={users[post.user_id]}
            onLike={toggleLike(post.id)}
            onRemove={removePost(post.id)}
            onExpand={this.onPostExpand(post, index)}
          />
        ))}

        { postCount > 0 && (
          <div className='posts-load-more' onClick={this.loadMore}>
            <Waypoint onEnter={this.loadMore} />
          </div>
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

        <style jsx>{`
          .posts-load-more {
            height: 25px;
            margin: 10px 0;
            line-height: 25px;
            cursor: pointer;
            background-color: color(#ebebeb b(+5%));
          }
        `}</style>
      </div>
    )
  }
}

const mapStateToProps = ({ posts, likes, auth }) => ({
  ...posts.posts,
  likes: likes.posts || [],
  loggedUser: auth.user ? auth.user.id : null
})

const mapDispatchToProps = dispatch => ({ dispatch })

const mergeProps = (state, dispatchProps, props) => {
  console.log(state.likes)

  const getPosts = async params => {
    dispatchProps.dispatch(startListFetch())
    await dispatchProps.dispatch(fetchPosts(params))
    dispatchProps.dispatch(endListFetch())
  }

  const updateParams = async (params, rewrite = false) => {
    await dispatchProps.dispatch(queryUpdate(params, rewrite))
    await getPosts({ ...(rewrite ? {} : state.query), ...params })
  }

  const toggleLike = postId => async () => {
    if (state.likes.indexOf(postId) > -1) await dispatchProps.dispatch(removeLike(postId))
    else await dispatchProps.dispatch(addLike(postId))
  }

  const removePost = postId => async () => {
    await dispatchProps.dispatch(deletePost(postId))
  }

  return {
    ...state,
    ...props,
    getPosts,
    toggleLike,
    updateParams,
    removePost
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(PostList)

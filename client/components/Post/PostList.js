import Router from 'next/router'
import { isEqual } from 'lodash'
import Waypoint from 'react-waypoint'
import { connect } from 'react-redux'
import React, { Component } from 'react'

import Post from './Post'
import Panel from '../Panel'
import PostFull from './Full'
import PostModal from './Modal'
import OverlayLoader from '../OverlayLoader'

import { getInitialProps, mapStateToProps, mapDispatchToProps, mergeProps } from '../../utils/Post/list'

const isLiked = (likes, id) => (likes || []).indexOf(id) > -1

class PostList extends Component {
  static async getInitial (dispatch, params, serverPath) {
    await getInitialProps(dispatch, params, serverPath)
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
    const { posts = [], users = {}, fetching, removePost, toggleLike, loggedUser, likes, total } = this.props
    const { expanded } = this.state

    let postCount = posts.length

    return (
      <OverlayLoader loading={fetching}>
        { postCount > 0 && posts.map((post, index) => (
          <Post key={post.id} {...post} loggedUser={loggedUser} user={users[post.user_id]} isLiked={isLiked(likes, post.id)} onLike={toggleLike(post.id)} onRemove={removePost(post.id)} onExpand={this.onPostExpand(post, index)} />
        ))}

        { (postCount > 0 && total > postCount) && (
          <div className='posts-load-more' onClick={this.loadMore}>
            <Waypoint onEnter={this.loadMore} />
          </div>
        )}

        { (!postCount && !fetching) && (
          <Panel noBody Header={<div className='panel__title'>Лента пуста</div>} />
        )}

        {/* Модалка с постом */}
        { !!expanded && (
          <PostModal isOpened={!!expanded} onPaginate={this.onPostPaginate} onClose={this.onPostExpand(null)}>
            <PostFull {...expanded} loggedUser={loggedUser} user={users[expanded.user_id]} isLiked={isLiked(likes, expanded.id)} onLike={toggleLike(expanded.id)} />
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
      </OverlayLoader>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(PostList)

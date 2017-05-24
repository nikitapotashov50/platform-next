import React, { Component } from 'react'
import { bindActionCreators } from 'redux'

import PageHoc from '../client/hocs/Page'
import ErrorLayout from '../client/layouts/error'
import FullPost from '../client/components/Post/Full'
import DefaultLayout from '../client/layouts/default'

import { addLike, removeLike } from '../client/redux/likes'
import { fetchPosts, endListFetch, startListFetch } from '../client/redux/posts/index'

import { getInitialProps } from '../client/utils/Post/list'

class PostPage extends Component {
  async componentWillReceiveProps (nextProps) {
    if (nextProps.program !== this.props.program) await this.props.getPosts({ programId: nextProps.program })
  }

  render () {
    let { post, loggedUser, author, toggleLike, isLiked } = this.props
    if (!post) return <ErrorLayout code={404} message={'Запрашиваемой вами страницы не существует'} />

    return (
      <DefaultLayout>
        <FullPost {...post} user={author} loggedUser={loggedUser} onLike={toggleLike} isLiked={isLiked} />
      </DefaultLayout>
    )
  }
}

PostPage.getInitialProps = async ({ query, store, req, ...ctx }) => {
  let { user } = store.getState()

  let params = {
    by_post_id: query.postId,
    programId: user.programs.current || null
  }

  if (req) params.user = req.session.user ? req.session.user.id : null

  await getInitialProps(store.dispatch, params, BACKEND_URL)

  return { postId: query.postId }
}

const mapStateToProps = ({ likes, auth, user, posts }) => ({
  posts: posts.posts,
  likes: likes.posts || [],
  program: user.programs.current,
  loggedUser: auth.user ? auth.user.id : null
})

const mapDispatchToProps = dispatch => bindActionCreators({
  addLike,
  removeLike,
  //
  fetchPosts,
  endListFetch,
  startListFetch
}, dispatch)

const mergeProps = (state, dispatch, props) => {
  let { postId } = props
  let post = state.posts.posts.filter(el => el.id === Number(postId)).shift()

  const getPosts = async params => {
    dispatch.startListFetch()
    await dispatch.fetchPosts({ ...params, by_post_id: postId })
    dispatch.endListFetch()
  }

  if (!post) return { ...props, ...state, getPosts }

  const toggleLike = async () => {
    if (state.likes.indexOf(postId) > -1) await dispatch.removeLike(postId)
    else await dispatch.addLike(postId)
  }

  const isLiked = (state.likes || []).indexOf(postId) > -1

  let author = state.posts.users[post.user_id]

  return {
    ...state,
    ...props,
    isLiked,
    toggleLike,
    getPosts,
    author,
    post
  }
}

export default PageHoc(PostPage, {
  title: 'Пост',
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
})

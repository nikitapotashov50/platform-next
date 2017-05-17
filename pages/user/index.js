import axios from 'axios'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'

import { server } from '../../config'
import Page from '../../client/hocs/Page'
import UserProfile from '../../client/hocs/UserProfile'

import UserLayout from '../../client/layouts/user'
import PostList from '../../client/components/Post/PostList'
import PostEditor from '../../client/components/PostEditor/index'
// import ReplyForm from '../../client/components/ReplyForm'

import { loadPosts } from '../../client/redux/posts'

class UserPage extends Component {
  static async getInitialProps ({ store }) {
    const baseURL = `http://${server.host}:${server.port}`
    const state = store.getState()
    const { data } = await axios.get(`${baseURL}/api/post`, {
      params: {
        byUserId: state.auth.user.id
      }
    })
    store.dispatch(loadPosts(data))
  }

  render () {
    const { posts, isMe, url } = this.props

    return (
      <UserLayout>
        <div className='user-blog'>

          { isMe && <PostEditor />}

          <div className='user-blog__content'>
            <PostList posts={posts} pathname={url.pathname} />
          </div>

        </div>
      </UserLayout>
    )
  }
}

let mapStateToProps = ({ posts, auth, profile }) => ({
  posts: posts.posts,
  isMe: auth.user && profile.user && (auth.user.id === profile.user.id)
})

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    loadPosts
  }, dispatch),
  dispatch
})

export default Page(UserProfile(UserPage), {
  title: 'Профиль',
  mapStateToProps,
  mapDispatchToProps
})

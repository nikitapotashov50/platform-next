import axios from 'axios'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import Waypoint from 'react-waypoint'

import Page from '../../client/hocs/Page'
import UserProfile from '../../client/hocs/UserProfile'

import UserLayout from '../../client/layouts/user'
import PostList from '../../client/components/Post/PostList'
import PostEditor from '../../client/components/PostEditor/index'
// import ReplyForm from '../../client/components/ReplyForm'

import { loadPosts, loadMore } from '../../client/redux/posts'

class UserPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      offset: 20
    }
    this.scrollDownHandle = this.scrollDownHandle.bind(this)
  }

  static async getInitialProps ({ store, ...ctx }) {
    const state = store.getState()

    const { data } = await axios.get(`${BACKEND_URL}/api/post`, {
      params: {
        by_author_id: state.profile.user.id,
        user: state.auth.user
      }
    })
    store.dispatch(loadPosts(data))
  }

  scrollDownHandle () {
    this.props.loadMore({
      offset: this.state.offset,
      user: this.props.auth.user,
      by_author_id: this.props.user.id
    })

    this.setState({
      offset: this.state.offset * 2
    })
  }

  render () {
    const { posts, isMe, url } = this.props

    return (
      <UserLayout>
        <div className='user-blog'>

          { isMe && <PostEditor />}

          <div className='user-blog__content'>
            <PostList posts={posts} pathname={url.pathname} />
            <Waypoint onEnter={this.scrollDownHandle} />
          </div>

        </div>
      </UserLayout>
    )
  }
}

let mapStateToProps = ({ posts, auth, profile }) => ({
  posts: posts.posts,
  auth,
  user: profile.user,
  isMe: auth.user && profile.user && (auth.user.id === profile.user.id)
})

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    loadPosts,
    loadMore
  }, dispatch),
  dispatch
})

export default Page(UserProfile(UserPage), {
  title: 'Профиль',
  mapStateToProps,
  mapDispatchToProps
})

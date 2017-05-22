import React, { Component } from 'react'

import Page from '../../client/hocs/Page'
import UserProfile from '../../client/hocs/UserProfile'

import UserLayout from '../../client/layouts/user'
import PostList from '../../client/components/Post/PostList'
import PostEditor from '../../client/components/PostEditor/index'

class UserPage extends Component {
  static async getInitialProps ({ store, ...ctx }) {
    let { auth, profile, user } = store.getState()
    let params = {
      user: auth.user,
      by_author_id: profile.user.id,
      programId: user.programs.current || null
    }

    await PostList.getInitial(store.dispatch, params, BACKEND_URL)
  }

  render () {
    const { isMe, url } = this.props

    let params = {
      by_author_id: this.props.user.id,
      programId: this.props.program
    }

    let pathname = {
      href: url.pathname + '?username=' + url.query.username,
      path: '/@' + url.query.username
    }

    return (
      <UserLayout>
        <div className='user-blog'>

          { isMe && <PostEditor />}

          <div className='user-blog__content'>
            <PostList params={params} pathname={pathname} />
          </div>

        </div>
      </UserLayout>
    )
  }
}

let mapStateToProps = ({ auth, profile, user }) => ({
  user: profile.user,
  program: user.programs.current,
  isMe: auth.user && profile.user && (auth.user.id === profile.user.id)
})

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default Page(UserProfile(UserPage), {
  title: 'Профиль',
  mapStateToProps,
  mapDispatchToProps
})

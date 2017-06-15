import React, { Component } from 'react'
import NoSSR from 'react-no-ssr'

import Page from '../../client/hocs/Page'
import UserProfile from '../../client/hocs/UserProfile'

import UserLayout from '../../client/layouts/user'
import PostList from '../../client/components/Post/PostList'
import PostEditor from '../../client/components/PostEditor/index'

class UserPage extends Component {
  static async getInitialProps ({ store, req, ...ctx }) {
    let { profile, user } = store.getState()
    let headers = null

    let params = {
      authorIds: profile.user._id,
      programId: user.programs.current || null
    }

    if (req) {
      headers = req.headers
      params.user = req.session.uid || null
    }

    await PostList.getInitial(store.dispatch, params, { headers })
  }

  render () {
    const { isMe, url } = this.props

    let params = {
      authorIds: this.props.user._id,
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
            <NoSSR onSSR={<div>Загрузка</div>}>
              <PostList params={params} pathname={pathname} />
            </NoSSR>
          </div>

        </div>
      </UserLayout>
    )
  }
}

let mapStateToProps = ({ auth, profile, user }) => ({
  user: profile.user,
  program: user.programs.current,
  isMe: auth.user && profile.user && (auth.user._id === profile.user._id)
})

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default Page(UserProfile(UserPage), {
  title: 'Профиль',
  mapStateToProps,
  mapDispatchToProps
})

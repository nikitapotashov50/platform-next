import React, { Component } from 'react'
import axios from 'axios'
import config from '../config'
import DefaultLayout from '../client/layouts/default'
import Page from '../client/hocs/Page'
import PostEditor from '../client/components/PostEditor/index'
import PostList from '../client/components/Post/PostList'
import { loadPosts } from '../client/redux/actions'

class IndexPage extends Component {
  static async getInitialProps ({ store }) {
    const baseURL = `http://${config.server.host}:${config.server.port}`
    const { data } = await axios.get(`${baseURL}/api/post`)
    store.dispatch(loadPosts(data))
  }

  render () {
    return (
      <DefaultLayout>
        {this.props.user && (
          <div className='post-editor'>
            <PostEditor />
          </div>
        )}
        <div className='post-list'>
          <PostList posts={this.props.posts} />
        </div>

        <style jsx>{`
          .post-editor, .post-list {
            margin-top: 15px;
          }
        `}</style>
      </DefaultLayout>
    )
  }
}

export default Page(IndexPage, {
  title: 'Отчеты',
  mapStateToProps: state => ({
    user: state.user,
    posts: state.posts
  })
})

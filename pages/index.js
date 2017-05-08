import React, { Component } from 'react'
// import DefaultLayout from '../client/layouts/default'
import Page from '../client/hocs/Page'
import PostEditor from '../client/components/PostEditor/index'
import PostList from '../client/components/Post/PostList'

class IndexPage extends Component {
  render () {
    return (
      <div>
        {this.props.user && (
          <div className='post-editor'>
            <PostEditor />
          </div>
        )}
        <div className='post-list'>
          <PostList />
        </div>

        <style jsx>{`
          .post-editor, .post-list {
            margin-top: 15px;
          }
        `}</style>
      </div>
    )
  }
}

export default Page(IndexPage, {
  title: 'Главная',
  mapStateToProps: state => ({ user: state.user })
})

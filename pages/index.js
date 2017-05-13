import React, { Component } from 'react'
import axios from 'axios'
import config from '../config'
import FeedLayout from '../client/layouts/feed'
import Page from '../client/hocs/Page'
import PostEditor from '../client/components/PostEditor/index'
import PostList from '../client/components/Post/PostList'
import { loadPosts } from '../client/redux/posts'

//
import Panel from '../client/components/Panel'
import PanelMenu from '../client/components/PanelMenu'

const menuItems = [
  { href: '/', path: '/', title: 'Ссылка 1', code: 'index' },
  { href: '/', path: '/', title: 'Ссылка 2', code: 'index2' },
  { href: '/', path: '/', title: 'Ссылка 3', code: 'index3' }
]

class IndexPage extends Component {
  static async getInitialProps ({ store }) {
    const baseURL = `http://${config.server.host}:${config.server.port}`
    const { data } = await axios.get(`${baseURL}/api/post`)
    store.dispatch(loadPosts(data))
  }

  render () {
    return (
      <FeedLayout>
        {this.props.user && <PostEditor />}

        <Panel noBody noMargin noBorder menuStyles={{ noBorder: true }} Menu={() => <PanelMenu items={menuItems} selected={'index'} />} />

        <PostList posts={this.props.posts} />
      </FeedLayout>
    )
  }
}

export default Page(IndexPage, {
  title: 'Отчеты',
  mapStateToProps: state => ({
    user: state.auth.user,
    posts: state.posts.posts
  })
})

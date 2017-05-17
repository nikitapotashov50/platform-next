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
  // { href: '/', path: '/', title: 'Актуальное', code: 'index' },
  { href: '/', path: '/', title: 'Новое', code: 'index' },
  // { href: '/', path: '/', title: 'Лучшее', code: 'index3' },
  { href: '/', path: '/', title: 'Мои подписки', code: 'subscriptions' }
]

class IndexPage extends Component {
  static async getInitialProps ({ store, req }) {
    const baseURL = `http://${config.server.host}:${config.server.port}`

    const { data } = await axios.get(`${baseURL}/api/post`)

    store.dispatch(loadPosts(data))
  }

  render () {
    return (
      <FeedLayout>
        {this.props.user && <PostEditor />}

        <Panel noBody noMargin noBorder menuStyles={{ noBorder: true }} Menu={() => <PanelMenu items={menuItems} selected={'index'} />} />

        <PostList posts={this.props.posts} pathname={this.props.url.pathname} />
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

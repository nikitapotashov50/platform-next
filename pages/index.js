import React, { Component } from 'react'
import axios from 'axios'
import { bindActionCreators } from 'redux'
import Waypoint from 'react-waypoint'

import config from '../config'
import FeedLayout from '../client/layouts/feed'
import Page from '../client/hocs/Page'
import PostEditor from '../client/components/PostEditor/index'
import PostList from '../client/components/Post/PostList'
import { loadPosts, loadMore } from '../client/redux/posts'
import Panel from '../client/components/Panel'
import PanelMenu from '../client/components/PanelMenu'

const menuItems = [
  // { href: '/', path: '/', title: 'Актуальное', code: 'index' },
  { href: '/', path: '/', title: 'Новое', code: 'index' },
  // { href: '/', path: '/', title: 'Лучшее', code: 'index3' },
  { href: '/', path: '/', title: 'Мои подписки', code: 'subscriptions' }
]

class IndexPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      offset: 20
    }
    this.scrollDownHandle = this.scrollDownHandle.bind(this)
  }

  static async getInitialProps ({ store, req }) {
    const baseURL = `http://${config.server.host}:${config.server.port}`
    const state = store.getState()

    const { data } = await axios.get(`${baseURL}/api/post`, {
      params: {
        user: state.auth.user
      }
    })

    store.dispatch(loadPosts(data))
  }

  scrollDownHandle () {
    this.props.loadMore({
      offset: this.state.offset,
      user: this.props.user
    })
    this.setState({
      offset: this.state.offset * 2
    })
  }

  render () {
    return (
      <FeedLayout>
        {this.props.user && <PostEditor />}

        <Panel noBody noMargin noBorder menuStyles={{ noBorder: true }} Menu={() => <PanelMenu items={menuItems} selected={'index'} />} />

        <PostList posts={this.props.posts} pathname={this.props.url.pathname} />
        <Waypoint onEnter={this.scrollDownHandle} />
      </FeedLayout>
    )
  }
}

export default Page(IndexPage, {
  title: 'Отчеты',
  mapStateToProps: state => ({
    user: state.auth.user,
    posts: state.posts.posts
  }),
  mapDispatchToProps: dispatch => bindActionCreators({
    loadMore
  }, dispatch)
})

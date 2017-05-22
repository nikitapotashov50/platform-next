import React, { Component } from 'react'
import axios from 'axios'
import { bindActionCreators } from 'redux'
import Waypoint from 'react-waypoint'

import FeedLayout from '../client/layouts/feed'
import Page from '../client/hocs/Page'
import PostEditor from '../client/components/PostEditor/index'
import PostList from '../client/components/Post/PostList'
import { loadPosts, loadMore } from '../client/redux/posts'
// import Panel from '../client/components/Panel'
// import PanelMenu from '../client/components/PanelMenu'

// const menuItems = [
//   { href: '/', path: '/', title: 'Новое', code: 'index' },
//   { href: '/?tab=subscriptions', path: '/feed/subscriptions', title: 'Мои подписки', code: 'subscriptions' }
// ]

class IndexPage extends Component {
  constructor (props) {
    super(props)
    this.state = { offset: 20 }
    this.scrollDownHandle = this.scrollDownHandle.bind(this)
  }

  static async getInitialProps ({ store, req, query }) {
    const state = store.getState()

    let params = { user: state.auth.user }
    if (query.tab === 'subscriptions' && state.auth.user) {
      params.by_author_id = state.auth.subscriptions.join(',')
    }

    const { data } = await axios.get(`${BACKEND_URL}/api/post`, { params })

    store.dispatch(loadPosts(data))
  }

  scrollDownHandle () {
    let params = {
      offset: this.state.offset,
      user: this.props.user
    }

    if (this.props.url.query.tab === 'subscriptions') params.by_author_id = this.props.subscr.join(',')

    this.props.loadMore(params)
    this.setState({
      offset: this.state.offset * 2
    })
  }

  render () {
    // let { tab = 'index' } = this.props.url.query

    return (
      <FeedLayout>
        {this.props.user && <PostEditor />}

        {/* МЕНЮШКА ПОСТОВ */}
        {/* <Panel noBody noMargin noBorder menuStyles={{ noBorder: true }} Menu={() => <PanelMenu items={menuItems} selected={tab} />} /> */}

        { (this.props.posts.length > 0) && <PostList posts={this.props.posts} pathname={this.props.url.pathname} />}
        { !this.props.posts.length && (
          <div>Пусто</div>
        )}
        <Waypoint onEnter={this.scrollDownHandle} />
      </FeedLayout>
    )
  }
}

export default Page(IndexPage, {
  title: 'Отчеты',
  mapStateToProps: state => ({
    user: state.auth.user,
    subscr: state.auth.subscriptions || [],
    posts: state.posts.posts
  }),
  mapDispatchToProps: dispatch => ({
    ...bindActionCreators({
      loadMore
    }, dispatch),
    dispatch
  })
})

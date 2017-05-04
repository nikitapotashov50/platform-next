import React, { Component } from 'react'
import Page from '../client/hocs/Page'

class PostsPage extends Component {
  render () {
    let { props } = this
    return (
      <div>Посты {props.url.query.id}</div>
    )
  }
}

export default Page(PostsPage)

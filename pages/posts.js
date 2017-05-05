import React, { Component } from 'react'
import DefaultLayout from '../client/layouts/default'

class PostsPage extends Component {
  render () {
    let { props } = this
    return (
      <div>Посты {props.url.query.id}</div>
    )
  }
}

export default DefaultLayout(PostsPage)

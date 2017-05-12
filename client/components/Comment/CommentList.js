import React, { Component } from 'react'
import { isEmpty } from 'lodash'
import Comment from './Comment'

class CommentList extends Component {
  render () {
    const { comments } = this.props

    if (isEmpty(comments)) {
      return null
    }

    return (
      <div>
        {comments.map(comment => (
          <Comment key={comment.id} {...comment} />
        ))}
      </div>
    )
  }
}

export default CommentList

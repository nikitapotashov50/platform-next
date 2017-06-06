import React, { Component } from 'react'
import { isEmpty, size, takeRight } from 'lodash'
import Comment from './Comment'

class CommentList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      all: props.full || false,
      showAllButton: props.full || size(this.props.comments) > 3
    }
  }

  render () {
    let comments = []
    let { all } = this.state

    if (isEmpty(this.props.comments)) {
      return null
    }

    if (!this.state.all && this.state.showAllButton) {
      comments = takeRight(this.props.comments, 3)
    } else {
      comments = this.props.comments
    }

    return (
      <div className=''>
        { (!this.props.full && this.state.showAllButton) && (
          <button className='show-more-comments' onClick={() => { this.setState({ all: !all }) }}>
            {all ? 'Скрыть комментарии' : 'Показать больше'}
          </button>
        )}

        {comments.map(comment => (
          <Comment key={comment.id} {...comment} />
        ))}

        <style jsx>{`
          .show-more-comments {
            transition: background .25s;

            width: 100%;
            height: 30px;
            line-height: 30px;
            margin-bottom: 10px;

            cursor: pointer;
            font-size: 12px;
            text-align: center;
            background: color(#efeff0 a(-5%));
          }

          .show-more-comments:hover {
            background: color(#efeff0 a(-35%));
          }
        `}</style>
      </div>
    )
  }
}

export default CommentList

import React, { Component } from 'react'
import { isEmpty, size, takeRight } from 'lodash'
import Comment from './Comment'

class CommentList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      all: false,
      showAllButton: size(this.props.comments) > 3
    }
  }

  render () {
    let comments = []

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
        {/* {this.state.showAllButton && <button
          className='show-more-comments'
          onClick={() => {
            this.setState({
              all: !this.state.all
            })
          }}>
          Показать {this.state.all ? 'меньше' : 'больше'}
        </button>} */}
        {comments.map(comment => (
          <Comment key={comment.id} {...comment} />
        ))}

        <style jsx>{`
          .show-more-comments {
            height: 50px;
            width: 100%;
            background: #ccc;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            cursor: pointer;
            transition: background 0.2s ease;
          }

          .show-more-comments:hover {
            background: #666;
          }
        `}</style>
      </div>
    )
  }
}

export default CommentList

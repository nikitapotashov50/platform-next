import axios from 'axios'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import clickOutside from 'react-click-outside'

import { addComment } from '../../redux/posts'
import Button from '../../elements/Button'
import UserImage from '../User/Image'

class CommentForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      content: '',
      expanded: false
    }
    this.handleContentChange = this.handleContentChange.bind(this)
    this.createComment = this.createComment.bind(this)
    this.clearForm = this.clearForm.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  handleContentChange (e) {
    this.setState({
      content: e.target.value
    })
  }

  handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.createComment()
    }
  }

  async createComment (e) {
    const { content } = this.state
    const { postId } = this.props

    if (content) {
      const { data } = await axios.post(`/api/post/${postId}/comment`, { content })
      this.props.addComment({ ...data })
      this.clearForm()
    }
  }

  toggleExpand (flag) {
    this.setState(state => {
      state.expanded = flag
    })
  }

  clearForm () {
    this.setState({
      content: ''
    })
  }

  handleClickOutside () {
    if (this.state.content) return

    this.setState(state => {
      state.content = ''
      state.expanded = false
    })
  }

  render () {
    const { user } = this.props
    const { expanded = false, content } = this.state

    return (
      <div className='post-comment'>
        <div className='post-comment__block post-comment__block_image'>
          <UserImage user={user} smallest />
        </div>
        <div className='post-comment__block post-comment__block_body'>
          <textarea className={[ 'post-comment__input', !expanded ? 'post-comment__input_collapsed' : '' ].join(' ')}
            value={content}
            ref={ref => { this.inputRef = ref }}
            rows={expanded ? 3 : 1}
            onKeyPress={this.handleKeyPress}
            onChange={this.handleContentChange}
            onFocus={this.toggleExpand.bind(this, true)}
            type='text' placeholder='Оставить комментарий'
          />
        </div>

        { expanded && (
          <div className='post-comment__button-block'>
            <Button onClick={this.createComment}>Отправить</Button>
          </div>
        ) }

        <style jsx>{`
          .post-comment {}
          .post-comment__block {
            box-sizing: border-box;

            vertical-align: top;
            display: inline-block;
          }
          .post-comment__block_body {
            padding-left: 10px;
            width: calc(100% - 40px);
          }
          .post-comment__block_image {
            width: 40px;
            padding: 0 5px;
          }
          .post-comment__input {
            padding: 0;
            padding: 5px 0;
            line-height: 20px;
            border: none;
          }
          .post-comment__input_collapsed {
            padding: 0;
            height: 30px;
            line-height: 30px;
          }
          .post-comment__button-block {
            padding-top: 10px;
            text-align: right;
            border-top: 1px solid #efeff0;
          }
        `}</style>
      </div>
    )
  }
}

CommentForm.inputRef = null

let wrappedComponent = clickOutside(CommentForm)

const mapDispatchToProps = dispatch => bindActionCreators({
  addComment
}, dispatch)

export default connect(null, mapDispatchToProps)(wrappedComponent)

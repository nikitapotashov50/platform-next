import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import clickOutside from 'react-click-outside'

import UserImage from '../User/Image'
import Button from '../../elements/Button'
import { add } from '../../redux/posts/comments'

const defaultState = { content: '', expanded: false }

class CommentForm extends Component {
  constructor (props) {
    super(props)
    this.state = { ...defaultState, ...(props.expanded ? { expanded: true } : {}) }

    this.clearForm = this.clearForm.bind(this)
    this.createComment = this.createComment.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleContentChange = this.handleContentChange.bind(this)
  }

  componentDidMount () {
    if (this.props.expanded && this.inputRef) this.inputRef.focus()
  }

  handleContentChange (e) {
    this.setState({
      content: (e.target.value || '').replace(/(<([^>]+)>)/ig, '')
    })
  }

  toggleExpand (flag) {
    this.setState(state => { state.expanded = flag })
  }

  clearForm () {
    this.setState({ ...defaultState })
  }

  handleClickOutside () {
    if (this.state.content) return
    this.clearForm()
  }

  handleKeyPress (e) {
    if (e.key === 'Enter') this.createComment()
  }

  async createComment (e) {
    const { content } = this.state
    const { postId } = this.props

    if (content) {
      await this.props.addComment(content, postId)
      await this.clearForm()
    }
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
          <textarea
            placeholder='Оставить комментарий'
            className={[ 'post-comment__input', !expanded ? 'post-comment__input_collapsed' : '' ].join(' ')}
            value={content}
            rows={expanded ? 3 : 1}
            ref={ref => { this.inputRef = ref }}
            /* Describing form interactins */
            onKeyPress={this.handleKeyPress}
            onChange={this.handleContentChange}
            onFocus={this.toggleExpand.bind(this, true)}
          />
        </div>

        { expanded && (
          <div className='post-comment__button-block'>
            <Button onClick={this.createComment}>Отправить</Button>
          </div>
        ) }

        {/* TODO вынести стили в один файл */}
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


          /*  Мобильные стили */
          @media screen and (max-width: 39.9375em) {
            .post-comment__input {
              font-size:16px;
            }
          }
        `}</style>
      </div>
    )
  }
}

CommentForm.inputRef = null

let wrappedComponent = clickOutside(CommentForm)

const mapDispatchToProps = dispatch => bindActionCreators({
  addComment: add
}, dispatch)

export default connect(null, mapDispatchToProps)(wrappedComponent)

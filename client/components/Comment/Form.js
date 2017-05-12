import React, { Component } from 'react'
import Link from 'next/link'
import Img from 'react-image'
import { connect } from 'react-redux'
import axios from 'axios'
import { addComment } from '../../redux/posts'
import Button from '../../elements/Button'

class CommentForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      content: ''
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

    const comment = {
      content
    }

    if (content) {
      const { data } = await axios.post(`/api/post/${postId}/comment`, comment)
      this.props.addComment({ ...data })
      this.clearForm()
    }
  }

  clearForm () {
    this.setState({
      content: ''
    })
  }

  render () {
    const { user } = this.props

    return (
      <div className='post-comment'>
        <div className='user-photo-container'>
          <Link href={`/@${user.name}`}>
            <Img
              src={[
                user.picture,
                '/static/img/user.png'
              ]}
              alt={`${user.firstName} ${user.lastName}`}
              style={{
                width: '30px',
                borderRadius: '50%',
                marginRight: '10px'
              }} />
          </Link>
        </div>
        <input
          onChange={this.handleContentChange}
          onKeyPress={this.handleKeyPress}
          className='leave-comment'
          type='text'
          placeholder='оставить комментарий'
          value={this.state.content} />
        <Button onClick={this.createComment}>Отправить</Button>

        <style jsx>{`
          .post-comment {
            border-top: 1px solid #efeff0;
            margin-top: 15px;
            padding-top: 15px;
            display: flex;
            font-size: 14px;
          }

          input.leave-comment {
            border: none;
          }
        `}</style>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  addComment: comment => dispatch(addComment(comment))
})

export default connect(
  null,
  mapDispatchToProps
)(CommentForm)

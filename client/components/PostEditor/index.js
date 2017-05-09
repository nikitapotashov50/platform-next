import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import Form from './Form'
import { addPost } from '../../redux/store'

class PostEditor extends Component {
  constructor (props) {
    super(props)

    this.state = {
      expanded: false,
      title: '',
      content: ''
    }

    this.handleContentChange = this.handleContentChange.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.createPost = this.createPost.bind(this)
    this.expand = this.expand.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
    this.clearForm = this.clearForm.bind(this)
  }

  async createPost (e) {
    e.preventDefault()
    const { title, content } = this.state

    const post = {
      title,
      content
    }

    const { data } = await axios.post('/api/post', post)
    this.props.addPost(data)
    this.clearForm()
  }

  clearForm () {
    this.setState({
      expanded: false,
      title: '',
      content: ''
    })
  }

  expand () {
    this.setState({
      expanded: true
    })
  }

  handleContentChange (e) {
    this.setState({
      content: e.target.value
    })
  }

  handleTitleChange (e) {
    this.setState({
      title: e.target.value
    })
  }

  handleClickOutside () {
    if (this.state.title || this.state.content) return
    this.setState({
      expanded: false
    })
  }

  render () {
    if (!this.state.expanded) {
      return (
        <div className='narrow-editor' onClick={this.expand}>
          <div className='edit-icon'>
            <img src='/static/svg/edit.svg' />
          </div>
          {this.state.title ? this.state.title : 'Написать отчет за сегодня'}
          <style jsx>{`
            .narrow-editor {
              color: #ccc;
              background: #fff;
              border-radius: 4px;
              border: 1px solid #e1e3e4;
              font-size: 14px;
              display: flex;
              align-items: center;
              padding: 15px;
              cursor: text;
            }

            .edit-icon {
              width: 16px;
              margin-right: 10px;
            }
          `}</style>
        </div>
      )
    }

    return (
      <Form
        title={this.state.title}
        handleTitleChange={this.handleTitleChange}
        content={this.state.content}
        handleContentChange={this.handleContentChange}
        handleClickOutside={this.handleClickOutside}
        createPost={this.createPost}
      />
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  addPost: post => dispatch(addPost(post))
})

export default connect(mapStateToProps, mapDispatchToProps)(PostEditor)

import React, { Component } from 'react'
import axios from 'axios'
import { Raw, Plain } from 'slate'
import { connect } from 'react-redux'
import Form from './Form'

class PostEditor extends Component {
  constructor (props) {
    super(props)

    const editorInitialState = Raw.deserialize({
      nodes: [
        {
          kind: 'block',
          type: 'paragraph'
        }
      ]
    }, { terse: true })

    this.state = {
      expanded: false,
      title: '',
      body: editorInitialState,
      money: ''
    }

    this.handleBodyChange = this.handleBodyChange.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.createPost = this.createPost.bind(this)
    this.expand = this.expand.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  async createPost (e) {
    e.preventDefault()
    const { user } = this.props
    const { title } = this.state
    const body = Plain.serialize(this.state.body)

    await axios.post('/api/post', {
      title,
      body,
      userId: user.id
    })
  }

  expand () {
    this.setState({
      expanded: true
    })
  }

  handleBodyChange (editorState) {
    this.setState({
      body: editorState
    })
  }

  handleTitleChange (e) {
    this.setState({
      title: e.target.value
    })
  }

  handleClickOutside () {
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
        body={this.state.body}
        handleBodyChange={this.handleBodyChange}
        handleClickOutside={this.handleClickOutside}
        createPost={this.createPost}
      />
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps)(PostEditor)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updatePost } from '../../redux/posts/index'

class EditPost extends Component {
  constructor (props) {
    super(props)

    this.state = {
      updatedTitle: props.title,
      updatedContent: props.content
    }
  }

  async updatePost ({ title, content }) {
    this.props.updatePost(this.props.id, { title, content })
  }

  render () {
    const { exitEdit } = this.props

    return (
      <div>
        <input type='text' value={this.state.updatedTitle} onChange={e => {
          this.setState({
            updatedTitle: e.target.value
          })
        }} />
        <textarea value={this.state.updatedContent} onChange={e => {
          this.setState({
            updatedContent: e.target.value
          })
        }} />
        <div className='edit-post-buttons'>
          <button className='cancel' onClick={exitEdit}>Отмена</button>
          <button className='save' onClick={() => {
            const title = this.state.updatedTitle
            const content = this.state.updatedContent

            if (!title && !content) return

            this.updatePost({
              title,
              content
            })

            exitEdit()
          }}>Сохранить</button>
        </div>

        <style jsx>{`
          button {
            margin-left: 10px;
            cursor: pointer;
            border-radius: 3px;
            padding: 5px 10px;
          }

          .edit-post-buttons {
            display: flex;
            justify-content: flex-end;
          }

          .cancel:hover {
            background: #f5f7fa;
          }

          .save {
            color: #fff;
            background: #196aff;
          }

          input, textarea {
            border-radius: 3px;
            margin-bottom: 10px;
          }
        `}</style>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  updatePost
}, dispatch)

export default connect(null, mapDispatchToProps)(EditPost)

import axios from 'axios'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import clickOutside from 'react-click-outside'
import Dropzone from 'react-dropzone'
import { isEmpty } from 'lodash'

// import Form from './Form'
import { addPost } from '../../redux/posts'

class PostEditor extends Component {
  constructor (props) {
    super(props)

    this.state = {
      expanded: false,
      title: '',
      content: '',
      files: [],
      dropzoneActive: false
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
    const { title, content, files } = this.state
    const post = { title, content, files }

    if (title && content) {
      const { data } = await axios.post('/api/post', post, { withCredentials: true })
      this.props.addPost({ ...data, added: true })
      this.clearForm()
    }
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
    if (this.state.title || this.state.content || !isEmpty(this.state.files)) return

    this.setState({
      expanded: false
    })
  }

  render () {
    let { expanded, title, content, dropzoneActive } = this.state

    let textareaClasses = [ 'reply-form__textarea' ]
    if (!expanded) textareaClasses.push('reply-form__textarea_short')

    return (
      <Dropzone
        disableClick
        style={{}}
        onDragEnter={() => {
          this.setState({
            dropzoneActive: true
          })
        }}
        onDragLeave={() => {
          this.setState({
            dropzoneActive: false
          })
        }}
        onDrop={async files => {
          let formData = new FormData()
          formData.append('files', files)
          const { data } = await axios.post('/api/attachment', formData)

          this.setState({
            files: [...this.state.files, ...files],
            dropzoneActive: false,
            expanded: true
          })
        }}
      >
        { dropzoneActive && <div className='dropzone-overlay'>Drop files...</div> }

        <div className='reply-form'>
          { expanded && (
          <div className='panel panel_margin_small'>
            <input className='reply-form__input reply-form__input_text_big' value={title} onChange={this.handleTitleChange} type='text' placeholder='Заголовок отчета' />
          </div>
        )}

          <div className='panel panel_margin_small'>
            <textarea className={textareaClasses.join(' ')} value={content} onChange={this.handleContentChange} placeholder={'Написать отчет за сегодня'} rows={expanded ? 8 : 1} onFocus={this.expand} />
          </div>

          { expanded && (
            <div className='attachments'>
              {this.state.files.map(file => (
                <div key={file.preview} style={{ width: '300px' }}>
                  <img src={file.preview} className='preview-image' />
                </div>
              ))}
            </div>
          ) }

          { expanded && (
          <div className='reply-form__submit-block'>
            <button className='myBtn' onClick={this.createPost} type='submit' tabIndex='4'><span title='Запостить как '>Отправить</span></button>
          </div>
        )}

          <style jsx>{`
          .attachments {
            background: #fff;
            border-radius: 3px 3px 0 0;
            border: solid #e1e3e4;
            border-width: 0 0 1px 0;
            padding: 10px;
            display: flex;
          }

          .preview-image {
            /*border-radius: 20px;*/
            /*width: calc(100% * (1/3) - 10px - 1px);*/
          }

          .dropzone-overlay {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            padding: 2.5em 0;
            background: rgba(0,0,0,0.5);
            text-align: center;
            color: #fff;
          }
        `}</style>
        </div>
      </Dropzone>
    )
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  addPost
}, dispatch)

const wrappedComponent = clickOutside(PostEditor)

export default connect(() => ({}), mapDispatchToProps)(wrappedComponent)

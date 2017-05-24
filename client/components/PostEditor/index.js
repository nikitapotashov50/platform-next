import axios from 'axios'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import clickOutside from 'react-click-outside'
import Dropzone from 'react-dropzone'
import { isEmpty } from 'lodash'
import CameraIcon from 'react-icons/lib/fa/camera'
import RemoveButton from 'react-icons/lib/fa/close'
import { addPost } from '../../redux/posts'

class PostEditor extends Component {
  constructor (props) {
    super(props)

    this.state = {
      expanded: false,
      title: '',
      content: '',
      previewImages: [],
      attachments: [],
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

    const { program } = this.props
    const { title, content, attachments } = this.state

    if (!title || !content) return

    const post = { title, content, attachments, program }

    await this.props.addPost(post)
    this.clearForm()
  }

  clearForm () {
    this.setState({
      expanded: false,
      title: '',
      content: '',
      files: []
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
    let { expanded, title, content } = this.state

    let textareaClasses = [ 'reply-form__textarea' ]
    if (!expanded) textareaClasses.push('reply-form__textarea_short')

    return (
      <Dropzone
        disableClick
        ref={node => { this.dropzoneRef = node }}
        multiple={false}
        style={{}}
        onDragEnter={() => {
          this.setState({ dropzoneActive: true })
        }}
        onDragLeave={() => {
          this.setState({ dropzoneActive: false })
        }}
        onDrop={async ([file]) => {
          this.setState({
            previewImages: [...this.state.previewImages, Object.assign({}, file, { name: file.name, loading: true })],
            expanded: true,
            dropzoneActive: false
          })

          const formData = new window.FormData()
          formData.append('file', file)

          const { data } = await axios.post('/api/attachment', formData)

          const attachment = {
            key: data.key,
            url: data.url
          }

          this.setState({
            previewImages: this.state.previewImages.map(f => {
              return f.name === file.name ? Object.assign({}, f, { loading: false }) : f
            }),
            attachments: [...this.state.attachments, attachment]
          })
        }}
      >

        <div className='reply-form'>
          { expanded && (
          <div className='panel panel_margin_small'>
            <input className='reply-form__input reply-form__input_text_big' value={title} onChange={this.handleTitleChange} type='text' placeholder='Заголовок отчета' />
          </div>
        )}

          <div className='panel panel_margin_small'>
            <textarea className={textareaClasses.join(' ')} value={content} onChange={this.handleContentChange} placeholder={'Написать отчет за сегодня'} rows={expanded ? 8 : 1} onFocus={this.expand} />
          </div>

          { expanded && !isEmpty(this.state.previewImages) && (
            <div className='attachments'>
              {this.state.previewImages.map(file => (
                <div key={file.preview} style={{ width: '300px', position: 'relative' }}>
                  {file.loading && <div className='preview-image-progress'>Загрузка</div>}
                  <div className='preview-image-remove' onClick={() => {
                    this.setState({
                      previewImages: this.state.previewImages.filter(f => f.preview !== file.preview),
                      attachments: this.state.attachments.filter(f => f.key !== file.name)
                    })
                  }}><RemoveButton /></div>
                  <img src={file.preview} className='preview-image' />
                </div>
              ))}
            </div>
          ) }

          {expanded && (
            <div className='post-editor-footer'>
              <div>
                <button className='attach-button' type='button' onClick={() => { this.dropzoneRef.open() }}>
                  <CameraIcon />
                </button>
              </div>

              <div>
                <button className='myBtn' onClick={this.createPost} type='submit' tabIndex='4'><span title='Запостить как '>Отправить</span></button>
              </div>
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
            max-width: 100%;
          }

          .post-editor-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 10px 0;
          }

          .preview-image-progress {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            top: 0;
            right: 0;
            position: absolute;
            color: #fefefe;
            background: rgba(0,0,0,0.4);
            z-index: 2;
          }

          .preview-image-remove {
            top: 0;
            right: 0;
            position: absolute;
            color: #fefefe;
            background: rgba(0,0,0,0.9);
            padding: 1px;
            cursor: pointer;
            z-index: 3;
          }

          .preview-image-remove:hover {
            color: #fff;
          }

          .attach-button {
            background: #fff;
            font-size: 20px;
            border-radius: 4px;
            padding: 5px;
            color: #196aff;
            cursor: pointer;
            margin-right: 20px;
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

const mapStateToProps = ({ user, auth }) => ({
  isLogged: auth.isLogged,
  program: user.programs.current || null
})

const mapDispatchToProps = dispatch => bindActionCreators({
  addPost
}, dispatch)

const wrappedComponent = clickOutside(PostEditor)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedComponent)

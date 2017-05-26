import axios from 'axios'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import clickOutside from 'react-click-outside'
import Dropzone from 'react-dropzone'
import { isEmpty } from 'lodash'
import md5 from 'blueimp-md5'
import CameraIcon from 'react-icons/lib/fa/camera'
import RemoveButton from 'react-icons/lib/fa/close'
import pMap from 'p-map'
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
      dropzoneActive: false,
      buttonDisabled: false
    }

    this.handleContentChange = this.handleContentChange.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.createPost = this.createPost.bind(this)
    this.expand = this.expand.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
    this.clearForm = this.clearForm.bind(this)
    this.toggleButtonState = this.toggleButtonState.bind(this)
  }

  async createPost (e) {
    e.preventDefault()

    this.toggleButtonState() // disable create button

    const { program } = this.props
    const { title, content, attachments } = this.state

    if (!title || !content) return

    const post = { title, content, attachments, program }

    await this.props.addPost(post)

    this.toggleButtonState() // enable create button

    this.clearForm()
  }

  toggleButtonState () {
    this.setState({
      buttonDisabled: !this.state.buttonDisabled
    })
  }

  clearForm () {
    this.setState({
      expanded: false,
      title: '',
      content: '',
      previewImages: [],
      attachments: []
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
    if (
      this.state.title ||
      this.state.content ||
      !isEmpty(this.state.attachments)
    ) return

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
        multiple
        style={{}}
        onDragEnter={event => {
          const dataTransfer = event.dataTransfer
          // prevent dragging and dropping elements on the page
          if (!(dataTransfer.types && (dataTransfer.types.indexOf ? dataTransfer.types.indexOf('Files') !== -1 : dataTransfer.types.contains('Files')))) {
            this.setState({ dropzoneActive: false })
          } else {
            this.setState({ dropzoneActive: true })
          }
        }}
        onDragLeave={() => {
          this.setState({ dropzoneActive: false })
        }}
        onDrop={async files => {
          if (files.length === 0) {
            return
          }

          this.setState({
            previewImages: [
              ...this.state.previewImages,
              ...files.map(file => ({ ...file, loading: true }))
            ],
            expanded: true,
            dropzoneActive: false
          })

          await pMap(files, async file => {
            const formData = new window.FormData()
            formData.append('file', file)
            formData.append('hash', md5(file.preview))
            const { data } = await axios.post('/api/attachment', formData)

            this.setState({
              previewImages: this.state.previewImages.map(image => {
                return md5(image.preview) === md5(file.preview)
                  ? { ...image, loading: false }
                  : image
              }),
              attachments: [...this.state.attachments, data]
            })
          })
        }}
      >

        <div className='reply-form'>
          {this.state.dropzoneActive && (
            <div className='drop-overlay'>
              <div>Перенесите сюда файлы, чтобы прикрепить их к записи</div>
            </div>
          )}

          { expanded && (
          <div className='panel panel_margin_small'>
            <input className='reply-form__input reply-form__input_text_big' value={title} onChange={this.handleTitleChange} type='text' placeholder='Заголовок отчета' />
          </div>
        )}

          <div className='panel panel_margin_small'>
            <textarea className={textareaClasses.join(' ')} value={content} onChange={this.handleContentChange} placeholder={'Написать отчет за сегодня'} rows={expanded ? 8 : 1} onFocus={this.expand} />
          </div>

          {expanded && !isEmpty(this.state.previewImages) && (
            <div className='attachments-container'>
              {this.state.previewImages.map(file => (
                <div key={md5(file.preview)} style={{ position: 'relative' }}>
                  <a>
                    {file.loading && <div className='preview-image-progress'>Загрузка</div>}
                    <div className='preview-image-remove' onClick={() => {
                      this.setState({
                        previewImages: this.state.previewImages.filter(f => f.preview !== file.preview),
                        attachments: this.state.attachments.filter(f => f.hash !== md5(file.preview))
                      })
                      window.URL.revokeObjectURL(file.preview)
                    }}>
                      <RemoveButton />
                    </div>
                    <img src={file.preview} style={{ cursor: 'pointer' }} />
                  </a>
                </div>
              ))}
            </div>
          )}

          {expanded && (
            <div className='post-editor-footer'>
              <div>
                <button className='attach-button' type='button' onClick={() => { this.dropzoneRef.open() }}>
                  <CameraIcon />
                </button>
              </div>

              <div>
                <button
                  disabled={this.state.buttonDisabled}
                  className='myBtn'
                  onClick={this.createPost}
                  type='submit'
                  tabIndex='4'>
                  Отправить
                </button>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          .reply-form {
            position: relative;
          }

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
            font-size: 16px;
            font-weight: bold;
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
            border: 1px solid #e1e3e4;
          }

          .drop-overlay {
            position: absolute;
            background: rgba(12, 0, 255, 0.9);
            text-align: center;
            color: #fff;
            z-index: 5;
            width: 100%;
            height: 100%;
            padding: 10px;
            box-sizing: border-box;
            border-radius: 3px;
          }

          .drop-overlay div {
            border: 1px dashed #fff;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .attachments-container {
            background: #fff;
            border-radius: 3px 3px 0 0;
            border: solid #e1e3e4;
            border-width: 0 0 1px 0;
            padding: 10px;
            display: flex;
            flex-flow: row wrap;
          }

          .attachments-container > div {
            flex: auto;
            width: 150px;
            margin: 2px;
          }

          .attachments-container > div a {
            flex-grow: 1;
            flex-basis: 125px;
            max-width: 200px;
          }

          .attachments-container > div img {
            width: 100%;
            height: 100%;
          }
        `}</style>
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

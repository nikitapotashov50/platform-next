import axios from 'axios'
import md5 from 'blueimp-md5'
import { startsWith, isEmpty } from 'lodash'

import Dropzone from 'react-dropzone'

import VideoButton from './VideoButton'
import CameraIcon from 'react-icons/lib/fa/camera'
import FileIcon from 'react-icons/lib/fa/file-text-o'

import PreviewList from './Previews/List'

import React, { Component } from 'react'

const getFileType = mime => {
  if (startsWith(mime, 'image')) return 'image'
  if (startsWith(mime, 'application')) return 'document'
}

const acceptTypes = {
  image: 'image/*',
  document: 'application/*'
}

class AttachmentForm extends Component {
  constructor (props) {
    super(props)

    this.state = {
      accept: null,
      dropActive: false,
      tmp: [],
      attachments: [],
      loaded: []
    }

    this.onFileRemove = this.onFileRemove.bind(this)
    this.onVideoAdd = this.onVideoAdd.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.dragEnter = this.dragEnter.bind(this)
    this.dialogCancel = this.dialogCancel.bind(this)
    this.toggleDropzone = this.toggleDropzone.bind(this)
  }

  toggleDropzone (flag) {
    this.setState({ dropActive: flag })
  }

  dialogCancel () {
    this.setState({ accept: null })
  }

  onVideoAdd (url) {
    this.setState(state => {
      state.attachments.push({ type: 'video', url, hash: md5(url) })
    })
    this.props.addAttachment({ type: 'video', url, hash: md5(url) })
  }

  async onDrop (files) {
    if (!files || !files.length) return

    await this.setState(state => {
      state.tmp = [
        ...state.tmp,
        ...files.map(file => ({
          ...file, type: getFileType(file.type), hash: md5(file.preview), name: file.name
        }))
      ]
      state.dropActive = false
    })

    files.map(async file => {
      const formData = new window.FormData()
      formData.append('file', file)
      formData.append('hash', md5(file.preview))
      const { data } = await axios.post('/api/attachment', formData)

      await this.setState(state => {
        state.attachments.push(data)
        state.loaded.push(md5(file.preview))
      })
      this.props.addAttachment(data)
    })
  }

  async openUploader (type) {
    await this.setState({
      accept: acceptTypes[type] || null
    })
    this.dropRef.open()
  }

  dragEnter (e) {
    const data = e.dataTransfer
    let flag = data.types && (data.types.indexOf ? data.types.indexOf('Files') !== -1 : data.types.contains('Files'))

    if (!flag) this.setState({ dropzoneActive: false })
    else this.setState({ accept: null, dropzoneActive: true })
  }

  async onFileRemove (fileHash, preview) {
    await this.setState(state => {
      state.tmp = state.tmp.filter(f => f.hash !== fileHash)
      state.attachments = state.attachments.filter(f => f.hash !== fileHash)
    })
    this.props.updateAttachments(this.state.attachments)
    window.URL.revokeObjectURL(preview)
  }

  render () {
    let { children } = this.props
    let { dropActive, tmp, loaded, attachments, accept } = this.state

    let docs = tmp.filter(el => el.type === 'document')
    let images = tmp.filter(el => el.type === 'image')
    let videos = attachments.filter(el => el.type === 'video')

    return (
      <Dropzone
        style={{}}
        accept={accept}
        ref={ref => { this.dropRef = ref }}
        //
        multiple
        disableClick
        //
        onDrop={this.onDrop}
        onDragEnter={this.dragEnter.bind(this)}
        onDragLeave={this.toggleDropzone.bind(this, false)}
        onFileDialogCancel={this.dialogCancel.bind(this, null)}
      >
        { dropActive && (
          <div className='drop-overlay'>
            <div>Перенесите сюда файлы, чтобы прикрепить их к записи</div>
          </div>
        )}

        {children}

        { !isEmpty(images) && (<PreviewList items={images} loaded={loaded} onRemove={this.onFileRemove} />)}
        { !isEmpty(docs) && (<PreviewList items={docs} loaded={loaded} onRemove={this.onFileRemove} type='document' />)}
        { !isEmpty(videos) && (<PreviewList items={videos} loaded={{}} onRemove={() => {}} type='video' />)}

        <div className='attach-buttons'>
          <button className='attach-button' type='button'>
            <CameraIcon onClick={this.openUploader.bind(this, 'image')} />
          </button>

          <VideoButton onAdd={this.onVideoAdd} />

          <button className='attach-button' type='button'>
            <FileIcon onClick={this.openUploader.bind(this, 'document')} />
          </button>
        </div>

        <br />
        <style jsx>{`
          .attach-buttons {
            display: flex;
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

          .preview-image {
            max-width: 100%;
          }

          .attachments-image-container, .attachments-document-container {
            background: #fff;
            border-radius: 3px;
            border: 1px solid #e1e3e4;
            padding: 10px;
            display: flex;
            flex-flow: row wrap;
          }

          .attachments-image-container > div {
            flex: auto;
            width: 150px;
            margin: 2px;
          }

          .attachments-image-container > div a {
            flex-grow: 1;
            flex-basis: 125px;
            max-width: 200px;
          }

          .attachments-image-container > div img {
            width: 100%;
            height: 100%;
          }

          .attachments-document-container > div {
            border: 1px solid #e1e3e4;
            border-radius: 3px;
            padding: 10px 25px 10px 10px;
            font-size: 16px;
            margin-right: 10px;
            margin: 5px;
          }
        `}</style>
      </Dropzone>
    )
  }
}

export default AttachmentForm

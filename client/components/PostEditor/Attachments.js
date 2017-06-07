// import axios from 'axios'
// import md5 from 'blueimp-md5'
// import { startsWith } from 'lodash'

import Dropzone from 'react-dropzone'

import AddVideoButton from './AddVideoButton'
import CameraIcon from 'react-icons/lib/fa/camera'
import FileIcon from 'react-icons/lib/fa/file-text-o'

import React, { Component } from 'react'

class AttachmentForm extends Component {
  constructor (props) {
    super(props)

    this.state = {
      accept: null,
      dropActive: false,
      preview: {
        images: [],
        documents: []
      },
      attachments: []
    }

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

  onDrop () {}

  dragEnter () {
    this.toggleDropzone(true)
  }

  render () {
    let { children } = this.props
    let { dropActive } = this.state

    return (
      <Dropzone
        style={{}}
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

        <div className='attach-buttons'>
          <button className='attach-button' type='button'>
            <CameraIcon />
          </button>

          <AddVideoButton isOpen={false} />

          <button className='attach-button' type='button'>
            <FileIcon />
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
        `}</style>
      </Dropzone>
    )
  }
}

// class AttachmentForm extends Component {
//   render () {
//     return (
      // <div className='attach-buttons'>
      //   <button className='attach-button' type='button'>
      //     <CameraIcon />
      //   </button>

      //   <AddVideoButton isOpen={false} />

      //   <button className='attach-button' type='button'>
      //     <FileIcon />
      //   </button>

      //   <style jsx>{`
      //     .attach-buttons {
      //       display: flex;
      //     }

      //     .attach-button {
      //       background: #fff;
      //       font-size: 20px;
      //       border-radius: 4px;
      //       padding: 5px;
      //       color: #196aff;
      //       cursor: pointer;
      //       margin-right: 20px;
      //       border: 1px solid #e1e3e4;
      //     }
      //   `}</style>
      // </div>
//     )
//   }
// }

export default AttachmentForm

import React, { Component } from 'react'
import Lightbox from 'react-image-lightbox-universal'
import { endsWith, startsWith } from 'lodash'
import PDFFileIcon from 'react-icons/lib/fa/file-pdf-o'
import WordFileIcon from 'react-icons/lib/fa/file-word-o'
import FileIcon from 'react-icons/lib/fa/file-text-o'
import ReactPlayer from 'react-player'

const defaultState = { index: 0, isOpen: false }

class PostAttachments extends Component {
  constructor (props) {
    super(props)

    this.state = { ...defaultState }

    this.images = (this.props.items || [])
      .filter(x => startsWith(x.mime, 'image'))
      .map(x => ({ src: x.path }))

    this.open = this.open.bind(this)
    this.navigate = this.navigate.bind(this)
  }

  navigate (index) {
    return () => {
      this.setState(state => { state.index = index })
    }
  }

  close () {
    this.setState(defaultState)
  }

  open (index) {
    return () => {
      this.setState({ isOpen: true, index: index })
    }
  }

  getIcon (mime) {
    if (endsWith(mime, 'pdf"')) {
      return <PDFFileIcon />
    } else if (endsWith(mime, 'wordprocessingml.document"')) {
      return <WordFileIcon />
    }
    return <FileIcon />
  }

  render () {
    let { items } = this.props

    if (!items) return null

    let { isOpen, index } = this.state
    let { images } = this
    let imgLength = images.length

    return (
      <div>
        <div className='attachments-container'>
          {items.filter(x => startsWith(x.mime, 'image')).map((attachment, index) => (
            <div key={attachment._id}>
              <a onClick={this.open(index)}>
                <img src={attachment.path} style={{ cursor: 'pointer' }} />
              </a>
            </div>
          ))}
        </div>
        <div className='attachments-container'>
          {items.filter(x => startsWith(x.mime, 'video')).map(attachment => (
            <div key={attachment._id} className='attachment-video'>
              <ReactPlayer url={attachment.path} width='100%' />
            </div>
          ))}
        </div>
        <div className='attachments-container'>
          {items.filter(x => startsWith(x.mime, 'application')).map(attachment => (
            <div key={attachment._id} className='attachment-doc'>
              {this.getIcon(attachment.mime)} <a href={attachment.path}>{attachment.name}</a>
            </div>
          ))}
        </div>

        {isOpen && (
          <Lightbox
            mainSrc={images[index].src}
            prevSrc={images[(index + imgLength - 1) % imgLength].src}
            nextSrc={images[(index + 1) % imgLength].src}
            //
            onCloseRequest={this.close.bind(this)}
            onMoveNextRequest={this.navigate((index + 1) % imgLength)}
            onMovePrevRequest={this.navigate((index + imgLength - 1) % imgLength)}
          />
        )}

        <style jsx>{`
          .attachments-container {
            display: flex;
            flex-flow: row wrap;
          }

          .attachments-container div {
            flex: auto;
            width: 150px;
            margin: 2px;
          }

          .attachments-container div a {
            flex-grow: 1;
            flex-basis: 125px;
            max-width: 200px;
          }

          .attachments-container div img {
            width: 100%;
            height: 100%;
          }

          .attachment-doc {
            font-size: 18px;
            padding: 10px;
            border-radius: 3px;
            /*margin: 5px;*/
          }

          .attachment-doc:hover {
            background: #f5f7fa;
          }

          @media screen and (max-width: 400px) {
            .attachments-container div {
              width: 100px;
            }
            .attachments-container {
              padding: 0;
            }
          }
        `}</style>
      </div>
    )
  }
}

export default PostAttachments

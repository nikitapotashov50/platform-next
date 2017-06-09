import React, { Component } from 'react'
// import Lightbox from 'react-image-lightbox-universal'
import Lightbox from 'react-image-lightbox'
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

    let previews = { video: [], image: [], documents: [] }
    items.map(el => {
      if (startsWith(el.mime, 'image')) previews.image.push(el)
      if (startsWith(el.mime, 'video')) previews.video.push(el)
      if (startsWith(el.mime, 'application')) previews.documents.push(el)
    })

    return (
      <div className='attachment__wrap'>
        { (previews.image.length > 0) && (
          <div className='attachments-container'>
            {previews.image.map((attachment, index) => (
              <div key={attachment._id}>
                <a onClick={this.open(index)}>
                  <img src={attachment.path} style={{ cursor: 'pointer' }} />
                </a>
              </div>
            ))}
          </div>
        )}
        { (previews.video.length > 0) && (
          <div className='attachments-container'>
            {previews.video.map(attachment => (
              <div key={attachment._id} className='attachment-video'>
                <ReactPlayer url={attachment.path} width='100%' />
              </div>
            ))}
          </div>
        )}
        { (previews.documents.length > 0) && (
          <div className='attachments-container'>
            {previews.documents.map(attachment => (
              <div key={attachment._id} className='attachment-doc'>
                {this.getIcon(attachment.mime)} <a href={attachment.path}>{attachment.name}</a>
              </div>
            ))}
          </div>
        )}

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
            margin-top: 10px;
          }

          .attachments-container div {
            flex: auto;
            width: 150px;
            margin: 1px;
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

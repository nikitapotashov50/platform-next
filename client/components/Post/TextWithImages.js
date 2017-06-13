import React, { Component } from 'react'
import reactStringReplace from 'react-string-replace'
import { truncate } from 'lodash'
import marked from 'marked'

class TextWithImages extends Component {
  constructor (props) {
    super(props)

    this.state = { showFull: false }

    this.expandContent = this.expandContent.bind(this)
  }

  getTextAndImages (text) {
    return reactStringReplace(
      text,
      /((https?):\/\/(.*?).(png|jpg))/gi,
      (match, i, offset) => {
        return (
          <div>
            <img key={match + i + offset} src={match} />
            <style jsx>{`
              img {
                max-width: 100%;
                height: 100%;
                max-height: 350px;
                margin-top: 15px;
              }
            `}</style>
          </div>
        )
      }
    )
  }

  expandContent () {
    this.setState({ showFull: true })
  }

  render () {
    const maxSize = 500
    const { showFull } = this.state
    let [ content, images ] = this.getTextAndImages(this.props.text)

    let preview = (content.length < maxSize || content.length - maxSize < (maxSize / 3))
      ? null
      : truncate(content, { length: maxSize, separator: '\n', omission: '' })

    return (
      <div className=''>
        { (!showFull && preview) && (
          <div>
            <div className='marked-content' dangerouslySetInnerHTML={{ __html: marked(preview) }} />
            <a className='show-more-text' onClick={this.expandContent}>Показать полностью</a>
          </div>
        )}

        { (showFull || !preview) && (
          <div className='marked-content' dangerouslySetInnerHTML={{ __html: marked(content) }} />
        )}

        <div>{images}</div>

        <style jsx>{`
          .show-more-text {
            cursor: pointer;
            font-weight: bold;
            color: #196aff;
            line-height: 200%;
            opacity: 0.7;
          }
          .show-more-text:hover {
            opacity: 1;
          }
        `}</style>
      </div>
    )
  }
}

// .display-linebreak {
//             white-space: pre-line;
//           }

export default TextWithImages

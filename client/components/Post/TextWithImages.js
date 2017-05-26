import React, { Component } from 'react'
import reactStringReplace from 'react-string-replace'
import { truncate } from 'lodash'

class TextWithImages extends Component {
  constructor (props) {
    super(props)
    const [content, images] = this.getTextAndImages(props.text)
    this.state = {
      content,
      images
    }

    this.getContent = this.getContent.bind(this)
  }

  componentWillMount () {
    this.getContent(this.state.content)
  }

  getContent (text) {
    const maxSize = 500

    if (text.length < maxSize) return

    const shortContent = truncate(text, {
      length: maxSize,
      separator: '\n',
      omission: ''
    })

    this.setState({
      shortContent
    })
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

  render () {
    return (
      <div className='display-linebreak'>
        {this.state.shortContent ? (
          <div>
            <div>{this.state.shortContent}</div>
            <div>
              <a className='show-more-text' onClick={() => {
                this.setState({
                  shortContent: null
                })
              }}>Показать полностью</a>
            </div>
          </div>
        ) : (
          <div>{this.state.content}</div>
        )}
        {this.state.images}
        <style jsx>{`
          .display-linebreak {
            white-space: pre-line;
          }

          .show-more-text {
            cursor: pointer;
            font-weight: bold;
          }
        `}</style>
      </div>
    )
  }
}

export default TextWithImages

import React, { Component } from 'react'
import reactStringReplace from 'react-string-replace'
import { truncate } from 'lodash'

class TextWithImages extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showFull: false
    }
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
    const maxSize = 500
    const { showFull } = this.state
    const [content, images] = this.getTextAndImages(this.props.text)

    return (
      <div className='display-linebreak'>
        {!showFull ? (<div>
          {(content.length < maxSize || content.length - maxSize < (maxSize / 3))
            ? content
            : (
              <div>
                <div>{truncate(content, {
                  length: maxSize,
                  separator: '\n',
                  omission: ''
                })}</div>
                <div>
                  <a className='show-more-text' onClick={() => {
                    this.setState({
                      showFull: true
                    })
                  }}>Показать полностью</a>
                </div>
              </div>
            )}
        </div>) : content}
        <div>{images}</div>

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

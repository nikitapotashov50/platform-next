import React, { Component } from 'react'
import reactStringReplace from 'react-string-replace'
import { truncate } from 'lodash'

class TextWithImages extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showFull: false
    }

    this.getTextAndImages = this.getTextAndImages.bind(this)
    this.getShortText = this.getShortText.bind(this)
  }

  getShortText (text) {
    const maxSize = 500

    if (text.length < maxSize || text.length - maxSize < (maxSize / 3)) {
      return {
        text,
        short: false
      }
    }

    const shortContent = truncate(text, {
      length: maxSize,
      separator: '\n',
      omission: ''
    })

    return {
      text: shortContent,
      short: true
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
    const { showFull } = this.state
    const [content, images] = this.getTextAndImages(this.props.text)
    const { short, text } = this.getShortText(content)

    return (
      <div className='display-linebreak'>

        <div className='display-linebreak'>
          <div>{(showFull || !short) && text}</div>
          {short && (
            <div>
              <a className='show-more-text' onClick={() => {
                this.setState({
                  showFull: true
                })
              }}>Показать полностью</a>
            </div>
          )}
          <div>{images}</div>
        </div>

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

    // return (
    //   <div className='display-linebreak'>
    //     {this.state.shortContent ? (
    //       <div>
    //         <div>{this.state.shortContent}</div>
    //         <div>
    //           <a className='show-more-text' onClick={() => {
    //             this.setState({
    //               shortContent: null
    //             })
    //           }}>Показать полностью</a>
    //         </div>
    //       </div>
    //     ) : (
    //       <div>{this.state.content}</div>
    //     )}
    //     {this.state.longText
    //       ? this.getContent(this.props.text)
    //       : this.props.text
    //     }
    //     {this.state.images}
    //     <style jsx>{`
    //       .display-linebreak {
    //         white-space: pre-line;
    //       }
    //
    //       .show-more-text {
    //         cursor: pointer;
    //         font-weight: bold;
    //       }
    //     `}</style>
    //   </div>
    // )
  }
}

export default TextWithImages

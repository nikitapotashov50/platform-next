import React, { Component } from 'react'
import VideoIcon from 'react-icons/lib/fa/video-camera'
import Popover from 'react-popover'

class AddVideoButton extends Component {
  constructor (props) {
    super(props)

    this.state = {
      value: ''
    }
  }
  render () {
    const { isOpen, add, close, toggle } = this.props

    return (
      <Popover
        isOpen={isOpen}
        place='right'
        body={
          <div className='popover'>
            <input
              value={this.state.value}
              onChange={e => {
                this.setState({
                  value: e.target.value
                })
              }}
              placeholder='Ссылка на видео (youtube, vimeo)' />
            <div className='buttons'>
              <button onClick={close}>отмена</button>
              <button onClick={() => {
                if (this.state.value) {
                  add(this.state.value)
                }
              }}>добавить</button>
            </div>

            <style jsx>{`
              .popover {
                background: rgba(0, 0, 0, 0.8);
                color: #fff;
                padding: 10px;
                border-radius: 4px;
                width: 300px;
              }

              input {
                color: #000;
                border: none;
                margin-bottom: 5px;
              }

              .buttons {
                display: flex;
                justify-content: flex-end;
              }

              button {
                background: none;
                color: #fff;
                cursor: pointer;
                border-radius: 2px;
              }

              button:hover {
                background: rgba(255, 255, 255, 0.2);
              }
            `}</style>
          </div>
        }
        onOuterAction={close}>
        <div>
          <button
            className='attach-button'
            type='button' onClick={toggle}>
            <VideoIcon />
          </button>

          <style jsx>{`
            .attach-button {
              background: #fff;
              font-size: 20px;
              border-radius: 4px;
              padding: 10px 15px;
              color: #196aff;
              cursor: pointer;
              margin-right: 5px;
              border: 1px solid #e1e3e4;
            }
          `}</style>
        </div>
      </Popover>
    )
  }
}

export default AddVideoButton

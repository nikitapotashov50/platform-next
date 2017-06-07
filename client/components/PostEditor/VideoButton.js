import React, { Component } from 'react'
import VideoIcon from 'react-icons/lib/fa/video-camera'
import Popover from 'react-popover'

class AddVideoButton extends Component {
  constructor (props) {
    super(props)

    this.state = {
      value: '',
      isOpen: false
    }

    this.onAdd = this.onAdd.bind(this)
    this.toggle = this.toggle.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onChange (e) {
    this.setState({ value: e.target.value })
  }

  onAdd (e) {
    e.preventDefault()
    if (this.state.value) {
      this.props.onAdd(this.state.value)
      this.toggle(false)
    }
  }

  toggle (flag) {
    this.setState({ isOpen: flag })
  }

  render () {
    const { isOpen } = this.state

    let Body = (
      <div className='popover'>
        <input className='popover__input' value={this.state.value} onChange={this.onChange.bind(this)} placeholder='Ссылка на видео (youtube, vimeo)' />

        <div className='popover__buttons'>
          <button className='popover__button' onClick={this.toggle.bind(this, false)}>Отмена</button>
          <button className='popover__button' onClick={this.onAdd.bind(this)}>Добавить</button>
        </div>

        <style jsx>{`
          .popover {
            border-radius: 4px;

            width: 300px;
            padding: 15px;

            color: #fff;
            background: rgba(0, 0, 0, .45);
          }

          .popover__input {
            color: #000;
            border: none;
          }

          .popover__buttons {
            margin-top: 10px;
            text-align: right;
          }

          .popover__button {
            transition: background .25s;
            border-radius: 2px;

            padding: 5px 10px;
            line-height: 20px;

            color: #fff;
            cursor: pointer;
          }

          .popover__button:hover { background: rgba(255, 255, 255, .2); }
        `}</style>
      </div>
    )

    return (
      <Popover isOpen={isOpen} place='right' body={Body} onOuterAction={this.toggle.bind(this, false)} >
        <button className='attach-button' type='button' onClick={this.toggle.bind(this, true)}>
          <VideoIcon />
          <style jsx>{`
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
          `}</style>
        </button>
      </Popover>
    )
  }
}

export default AddVideoButton

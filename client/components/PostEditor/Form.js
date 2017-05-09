import React, { Component } from 'react'
import onClickOutside from 'react-onclickoutside'
import Button from '../../elements/Button'

class Form extends Component {
  constructor (props) {
    super(props)
    this.focusOnClick = this.focusOnClick.bind(this)
  }

  focusOnClick () {
    this.editor && this.editor.focus()
  }

  render () {
    return (
      <form>
        <input
          autoFocus
          className='title'
          type='text'
          placeholder='Заголовок отчета'
          value={this.props.title}
          onChange={this.props.handleTitleChange} />
        <div className='editor' onClick={this.focusOnClick}>
          <textarea
            placeholder='Текст отчета'
            value={this.props.content}
            onChange={this.props.handleContentChange}
            ref={editor => {
              this.editor = editor
            }} />
        </div>
        <Button onClick={this.props.createPost}>
          Сохранить
        </Button>

        <style jsx>{`
          .title, .editor {
            width: 100%;
            background: #fff;
            padding: 15px;
            border-radius: 4px;
            border: 1px solid #e1e3e4;
            font-size: 14px;
            box-sizing: border-box;
          }

          textarea {
            border: none;
          }

          .title {
            margin-bottom: 15px;
          }

          .editor {
            cursor: text;
            min-height: 100px;
            max-height: 500px;
            margin-bottom: 15px;
          }
        `}</style>
      </form>
    )
  }
}

export default onClickOutside(Form, {
  handleClickOutside: ({ props }) => props.handleClickOutside
})

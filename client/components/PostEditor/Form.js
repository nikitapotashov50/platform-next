import React, { Component } from 'react'
import { Editor } from 'slate'
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
          <Editor
            placeholder='Текст отчета'
            state={this.props.body}
            onChange={this.props.handleBodyChange}
            ref={editor => { this.editor = editor }} />
        </div>
        <Button onClick={this.props.createPost}>
          Сохранить
        </Button>

        <style jsx>{`
          input, .editor {
            width: 100%;
            background: #fff;
            padding: 15px;
            border-radius: 4px;
            border: 1px solid #e1e3e4;
            font-size: 14px;
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

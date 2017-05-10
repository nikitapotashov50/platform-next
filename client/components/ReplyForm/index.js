import React, { Component } from 'react'

class ReplyForm extends Component {
  constructor (props) {
    super(props)

    this.state = {
      focused: false
    }

    this.onFocus = this.onFocus.bind(this)
  }

  async onFocus () {
    await this.setState(state => {
      state.focused = true
    })
  }

  render () {
    let { focused } = this.state
    let textareaClasses = [ 'reply-form__textarea' ]
    if (!focused) textareaClasses.push('reply-form__textarea_short')

    return (
      <div className='reply-form'>
        { focused && (
          <div className='panel panel_margin_small'>
            <input className='reply-form__input reply-form__input_text_big' type='text' placeholder='Заголовок отчета' />
          </div>
        )}

        <div className='panel panel_margin_small'>
          <textarea className={textareaClasses.join(' ')} placeholder='Написать отчет за сегодня' rows={!focused ? 1 : 8} onFocus={this.onFocus} />
          { focused && (
            <input className='reply-form__input  reply-form__input_text_small reply-form__input_bordered' placeholder='Заработано за день, руб.' type='text' />
          )}
        </div>

        { focused && (
          <div className='reply-form__submit-block'>
            <button type='submit' className='myBtn' tabIndex='4'><span title='Запостить как “bm-paperdoll”'>Пост</span></button>
            <button type='submit' className='myBtn' tabIndex='4'><span title='Запостить как “bm-paperdoll”'>Пост</span></button>
          </div>
        )}
      </div>
    )
  }
}

export default ReplyForm

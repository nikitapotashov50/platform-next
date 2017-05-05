import React, { Component } from 'react'

class AuthSignup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fetching: false
    }

    this.submit = this.submit.bind(this)
  }

  submit (e) {
    e.preventDefault()
  }

  render () {
    // let { message } = this.props
    // let { fetching } = this.state

    return (
      <div className='login-form'>
        <h3 className='login-form__title'>Регистрация</h3>

        <form autoComplete='off' method='post'>
          <div className='login-form__row'>
            <label className='login-form__label'>email</label>
            <input className='login-form__input' type='text' />
          </div>

          <div className='login-form__row'>
            <label className='login-form__label'>Имя</label>
            <input className='login-form__input' type='text' />
          </div>

          <div className='login-form__row'>
            <label className='login-form__label'>Фамилия</label>
            <input className='login-form__input' type='text' />
          </div>

          <div className='login-form__row login-form__row_double-margin'>
            <button className='login-form__btn' type='submit'>Зарегистрироваться</button>
          </div>

        </form>

        <div className='login-form__row'>Условия и тд</div>
      </div>
    )
  }
}

export default AuthSignup

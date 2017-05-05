import axios from 'axios'
import { connect } from 'react-redux'
import React, { Component } from 'react'

import { auth } from '../../redux/store'

class AuthLogin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fetching: false,
      values: {
        email: '',
        password: ''
      },
      message: null
    }

    this.submit = this.submit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  submit = async e => {
    e.preventDefault()

    await this.setState(state => {
      state.fetching = true
    })

    let { email, password } = this.state.values

    try {
      let { data } = await axios.post('/api/auth/login', { email, password }, { withCredentials: true })
      setTimeout(async () => {
        this.props.dispatch(auth(data.user))

        await this.setState(state => {
          state.message = null
          state.fetching = false
        })

        this.props.onSuccess()
      }, 1000)
    } catch (error) {
      await this.setState(state => {
        state.fetching = false
        state.message = error.message
      })
    }
  }

  handleChange = async (field, event) => {
    if (Object.keys(this.state.values).indexOf(field) === -1) return false

    let { value } = event.target
    this.setState(state => {
      state.values[field] = value
    })
  }

  render () {
    let { message, fetching, values } = this.state

    return (
      <div className="">
        <div className="login-form">
          <h3 className="login-form__title">Авторизация</h3>
      
          <form method="post">
            <div className="login-form__row">
              <label className="login-form__label">Логин</label>
              <input className="login-form__input" value={ values.email } onChange={ this.handleChange.bind(this, 'email') } type="text" autoComplete="on" />
            </div>

            <div className="login-form__row">
              <label className="login-form__label">Пароль</label>
              <input className="login-form__input" value={ values.password } onChange={ this.handleChange.bind(this, 'password') } type="password" />
            </div>
            
            { message && <div >{ message }</div>}

            <div className="login-form__row login-form__row_double-margin">
              <button className='login-form__btn' type="submit" onClick={ this.submit }>{ fetching ? 'Загрузка' : 'Войти' }</button>
            </div>

            <div className="login-form__row login-form__row_centered">
              <a className="login-form__link" href="#">Восстановить пароль</a>
            </div>
            <div className="login-form__row login-form__row_centered">
              <div className="LoginForm__label-support">Текст всякий <a href="mailto:help@molodost.bz">help@molodost.bz</a></div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(AuthLogin)
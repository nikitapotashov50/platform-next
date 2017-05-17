import _ from 'lodash'
import axios from 'axios'
import React, { Component } from 'react'

import Modal from '../Modal'
import AuthLogin from '../Auth/Login'
import AuthSignup from '../Auth/Signup'
import AuthRecovery from '../Auth/Recovery'

import { auth } from '../../redux/auth'
import { fill as fillPrograms } from '../../redux/user/programs'

let defaultCredentials = {
  email: '',
  password: '',
  lastName: '',
  firstName: ''
}

class HeaderUnregisteredMenu extends Component {
  constructor (props) {
    super(props)

    this.state = {
      errors: {},
      modal: null,
      message: null,
      fetching: false,
      credentials: { ...defaultCredentials }
    }
  }

  async toggleModal (name) {
    if ([ 'login', 'signup', 'recovery', null ].indexOf(name) === -1) return false

    await this.setState(state => {
      state.modal = name
      state.errors = {}
      if (!name) {
        state.credentials = { ...defaultCredentials }
      }
    })
  }

  inputChange (field, event) {
    if (Object.keys(this.state.credentials).indexOf(field) === -1) return false

    let { value } = event.target
    this.setState(state => {
      state.credentials[field] = value.replace(/(<([^>]+)>)/ig, '')
    })
  }

  async startFetching () {
    await this.setState(state => {
      state.errors = {}
      state.fetching = true
    })
  }

  async pushErrors (errors) {
    await this.setState(state => {
      let errObj = {}
      errors.map(el => { errObj[el.type] = el.value })

      state.errors = errObj
    })
  }

  async login (e) {
    e.preventDefault()
    let { email, password } = this.state.credentials
    let errors = []

    if (!email || !email.length) errors.push({ type: 'email', value: 'Не указан email' })
    if (!password || !password.length) errors.push({ type: 'password', value: 'Не указан пароль' })

    if (errors.length) {
      this.pushErrors(errors)
      return false
    }

    await this.startFetching()

    try {
      let { data } = await axios.post('/api/auth/login', { email, password }, { withCredentials: true })

      await this.setState(state => {
        state.fetching = false
        state.modal = null
        state.credentials = { ...defaultCredentials }
      })
      this.props.dispatch(auth(data))
    } catch (error) {
      await this.setState(state => {
        state.fetching = false
        state.errors.fetching = error.message
      })
    }
  }

  async signup (e) {
    e.preventDefault()

    let { email, firstName, lastName } = this.state.credentials
    let errors = []

    if (!email || !email.length) errors.push({ type: 'email', value: 'Не указан email' })
    if (!firstName || !firstName.length) errors.push({ type: 'firstName', value: 'Не указано имя' })
    if (!lastName || !lastName.length) errors.push({ type: 'lastName', value: 'Не указана фамилия' })

    if (errors.length) {
      this.pushErrors(errors)
      return false
    }

    await this.startFetching()

    try {
      let { data } = await axios.post('/api/auth/register', { email, firstName, lastName }, { withCredentials: true })
      console.log(data)

      // this.props.dispatch(auth(data))
      // this.props.dispatch(fillPrograms(data.programs || []))

      // await this.setState(state => {
      //   state.fetching = false
      //   state.modal = null
      //   state.credentials = { ...defaultCredentials }
      // })
    } catch (error) {
      await this.setState(state => {
        // state.fetching = false
        // state.errors.fetching = error.message
      })
    }
  }

  async recovery (e) {
    e.preventDefault()

    let { email } = this.state.credentials
    let errors = []

    if (!email || !email.length) errors.push({ type: 'email', value: 'Не указан email' })

    if (errors.length) {
      this.pushErrors(errors)
      return false
    }

    await this.startFetching()

    try {
      await this.setState(state => {
        state.fetching = false
        state.message = 'Ссылка отправлена вам на почту'
      })
    } catch (error) {
      await this.setState(state => {
        state.fetching = false
        state.errors.fetching = error.message
      })
    }
  }

  render () {
    let { modal, errors, credentials, message, fetching } = this.state
    let { className } = this.props

    return (
      <div className={className}>
        <li className='user-menu__item user-menu__item_hoverable'>
          <a className='user-menu__link' onClick={this.toggleModal.bind(this, 'signup')}>Регистрация</a>
        </li>

        <li className='user-menu__item user-menu__item_hoverable'>
          <a className='user-menu__link' onClick={this.toggleModal.bind(this, 'login')}>Войти</a>
        </li>

        <Modal width={400} isOpened={modal} onClose={this.toggleModal.bind(this, null)}>
          { modal === 'signup' && (
            <AuthSignup onInput={this.inputChange.bind(this)} fetching={fetching} errors={errors} submit={this.signup.bind(this)} values={_.pick(credentials, [ 'email', 'firstName', 'lastName' ])} loginSwitch={this.toggleModal.bind(this, 'login')} />
          )}
          { modal === 'login' && (
            <AuthLogin onInput={this.inputChange.bind(this)} fetching={fetching} errors={errors} submit={this.login.bind(this)} values={_.pick(credentials, [ 'email', 'password' ])} recoverySwitch={this.toggleModal.bind(this, 'recovery')} />
          )}
          { modal === 'recovery' && (
            <AuthRecovery onInput={this.inputChange.bind(this)} fetching={fetching} errors={errors} submit={this.recovery.bind(this)} values={_.pick(credentials, [ 'email' ])} loginSwitch={this.toggleModal.bind(this, 'login')} message={message} />
          )}
        </Modal>
      </div>
    )
  }
}

export default HeaderUnregisteredMenu

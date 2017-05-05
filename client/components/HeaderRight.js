import _ from 'lodash'
import axios from 'axios'
import { connect } from 'react-redux'
import React, { Component } from 'react'

import Modal from './Modal'
import UserImage from './User/Image'
import AuthLogin from './Auth/Login'
import AuthSignup from './Auth/Signup'
import AuthRecovery from './Auth/Recovery'
import UserHeaderMenu from './User/HeaderMenu'

import { auth } from '../redux/store'

let defaultCredentials = {
  email: '',
  password: '',
  last_name: '',
  first_name: ''
}

class HeaderRight extends Component {
  constructor (props) {
    super(props)
    this.state = {
      modal: null,
      menu: false,
      credentials: { ...defaultCredentials },
      errors: {}
    }

    this.toggleMenu = this.toggleMenu.bind(this)
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

  async toggleMenu (flag) {
    await this.setState(state => {
      state.menu = flag
    })
  }

  inputChange (field, event) {
    if (Object.keys(this.state.credentials).indexOf(field) === -1) return false

    let { value } = event.target
    this.setState(state => {
      state.credentials[field] = value.replace(/(<([^>]+)>)/ig,"")
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
      errors.map(el => errObj[el.type] = el.value)

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
      
      this.props.dispatch(auth(data.user))

      await this.setState(state => {
        state.fetching = false
        state.modal = null
        state.credentials = { ...defaultCredentials }
      })
    } catch (error) {
      await this.setState(state => {
        state.fetching = false
        state.errors.fetching = error.message
      })
    }
  }

  async signup (e) {
    e.preventDefault()

    let { email, first_name, last_name } = this.state.credentials
    let errors = []

    if (!email || !email.length) errors.push({ type: 'email', value: 'Не указан email' })
    if (!first_name || !first_name.length) errors.push({ type: 'first_name', value: 'Не указано имя' })
    if (!last_name || !last_name.length) errors.push({ type: 'last_name', value: 'Не указана фамилия' })

    if (errors.length) {
      this.pushErrors(errors)
      return false
    }

    await this.startFetching()

    try {
      await this.setState(state => {
        state.fetching = false
        state.modal = null
        state.credentials = { ...defaultCredentials }
      })
    } catch (error) {
      await this.setState(state => {
        state.fetching = false
        state.errors.fetching = error.message
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
        state.modal = null
        state.credentials = { ...defaultCredentials }
      })
    } catch (error) {
      await this.setState(state => {
        state.fetching = false
        state.errors.fetching = error.message
      })
    }
  }

  render () {
    let { modal, menu, credentials, errors } = this.state
    let { user } = this.props

    return (
      <ul className='user-menu'>
        <li className='user-menu__item user-menu__item_no_padding' />

        <li className='user-menu__item user-menu__item_no_padding'>
          <a className='user-menu__link user-menu__link_icon user-menu__link_icon_search' />
        </li>

        { user && (
          <li className='user-menu__item user-menu__item_hoverable'>
            <UserImage small onClick={this.toggleMenu.bind(this, !menu)} />

            <UserHeaderMenu opened={menu} onClose={this.toggleMenu.bind(this, false)} />
          </li>
        )}

        { !user && (
          <li className='user-menu__item user-menu__item_hoverable'>
            <a className='user-menu__link' onClick={this.toggleModal.bind(this, 'signup')}>Регистрация</a>
          </li>
        )}

        { !user && (
          <li className='user-menu__item user-menu__item_hoverable'>
            <a className='user-menu__link' onClick={this.toggleModal.bind(this, 'login')}>Войти</a>
          </li>
        )}

        <Modal width={400} isOpened={modal} onClose={this.toggleModal.bind(this, null)}>
          { modal === 'signup' && (
            <AuthSignup onInput={this.inputChange.bind(this)} errors={errors} submit={this.signup.bind(this)} values={_.pick(credentials, [ 'email', 'first_name', 'last_name' ])} />
          )}
          { modal === 'login' && (
            <AuthLogin onInput={this.inputChange.bind(this)} errors={errors} submit={this.login.bind(this)} values={_.pick(credentials, [ 'email', 'password' ])} recoverySwitch={this.toggleModal.bind(this, 'recovery')} />
          )}
          { modal === 'recovery' && (
            <AuthRecovery onInput={this.inputChange.bind(this)} errors={errors} submit={this.recovery.bind(this)} values={_.pick(credentials, [ 'email' ])} loginSwitch={this.toggleModal.bind(this, 'login')} />
          )}
        </Modal>
      </ul>
    )
  }
}

let mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps)(HeaderRight)

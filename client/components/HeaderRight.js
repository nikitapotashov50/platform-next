import { connect } from 'react-redux'
import React, { Component } from 'react'

import Modal from './Modal'
import UserImage from './User/Image'
import AuthLogin from './Auth/Login'
import AuthSignup from './Auth/Signup'
import UserHeaderMenu from './User/HeaderMenu'

class HeaderRight extends Component {
  constructor (props) {
    super(props)
    this.state = {
      modal: {
        login: false,
        signup: false
      },
      menu: false
    }

    this.toggleMenu = this.toggleMenu.bind(this)
  }

  toggleModal (name, flag) {
    if (Object.keys(this.state.modal).indexOf(name) === -1) return false

    this.setState(state => {
      state.modal[name] = flag
    })
  }

  toggleMenu = async (flag) => {
    await this.setState(state => {
      state.menu = flag
    })
  }

  render () {
    let { modal, menu } = this.state
    let { user = null } = this.props

    return (
      <ul className="user-menu">
        <li className='user-menu__item user-menu__item_no_padding' />

        <li className="user-menu__item user-menu__item_no_padding">
          <a className="user-menu__link user-menu__link_icon user-menu__link_icon_search" />
        </li>

        { user && (
          <li className='user-menu__item user-menu__item_hoverable'>
            <UserImage small onClick={ this.toggleMenu.bind(this, !menu) } />
      
            <UserHeaderMenu opened={ menu } onClose={ this.toggleMenu.bind(this, false) } />
          </li>
        )}

        { !user && (
          <li className='user-menu__item user-menu__item_hoverable'>
            <a className="user-menu__link" onClick={ this.toggleModal.bind(this, 'signup', true) }>Регистрация</a>
          </li>
        )}
        
        { !user && (
          <li className='user-menu__item user-menu__item_hoverable'>
            <a className="user-menu__link" onClick={ this.toggleModal.bind(this, 'login', true) }>Войти</a>
          </li>
        )}

        <Modal width={ 400 } isOpened={ modal.signup } onClose={ this.toggleModal.bind(this, 'signup', false) }>
          <AuthSignup />
        </Modal>

        <Modal width={ 400 } isOpened={ modal.login } onClose={ this.toggleModal.bind(this, 'login', false) }>
          <AuthLogin onSuccess={ this.toggleModal.bind(this, 'login', false) } />
        </Modal>
      </ul>
    )
  }
}

let mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps)(HeaderRight)
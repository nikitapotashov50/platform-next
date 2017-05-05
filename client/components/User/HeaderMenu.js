import { connect } from 'react-redux'
import React, { Component } from 'react'
import clickOutside from 'react-click-outside'

import { logout } from '../../redux/store'

class UserHeaderMenu extends Component {
  constructor (props) {
    super(props)

    this.logout = this.logout.bind(this)
  }

  handleClickOutside () {
    if (this.props.opened && this.props.onClose) this.props.onClose()
  }

  logout () {
    this.props.dispatch(logout())
    if (this.props.onClose) this.props.onClose()
  }

  render () {
    let { opened } = this.props
    if (!opened) return null

    return (
      <ul className='user-sub-menu'>
        <li className='user-sub-menu__item'>
          <a className='user-sub-menu__link'>Профиль</a>
        </li>
        <li className='user-sub-menu__item'>
          <a className='user-sub-menu__link' href='#'>Ответы</a>
        </li>
        <li className='user-sub-menu__item'>
          <a className='user-sub-menu__link'>Настройки</a>
        </li>
        <li className='user-sub-menu__item'>
          <a className='user-sub-menu__link' onClick={this.logout}>Выйти</a>
        </li>
      </ul>
    )
  }
}

export default connect()(clickOutside(UserHeaderMenu))

import Link from 'next/link'
import React, { Component } from 'react'
import clickOutside from 'react-click-outside'

class UserHeaderMenu extends Component {
  handleClickOutside () {
    if (this.props.opened && this.props.onClose) this.props.onClose()
  }

  render () {
    let { opened, logout, user } = this.props
    if (!opened) return null

    return (
      <ul className='user-sub-menu'>
        <li className='user-sub-menu__item'>
          <Link href={'/user?username=' + user.name} as={'/@' + user.name}>
            <a className='user-sub-menu__link'>Профиль</a>
          </Link>
        </li>
        <li className='user-sub-menu__item'>
          <a className='user-sub-menu__link' href='#'>Ответы</a>
        </li>
        <li className='user-sub-menu__item'>
          <Link href='/account/settings'>
            <a className='user-sub-menu__link'>Настройки</a>
          </Link>
        </li>
        <li className='user-sub-menu__item'>
          <Link href={`/feedback`}>
            <a className='user-sub-menu__link'>Оставить отзыв</a>
          </Link>
        </li>
        <li className='user-sub-menu__item'>
          <a className='user-sub-menu__link' onClick={logout}>Выйти</a>
        </li>
      </ul>
    )
  }
}

export default clickOutside(UserHeaderMenu)

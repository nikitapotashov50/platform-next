import axios from 'axios'
import React, { Component } from 'react'

import UserImage from '../User/Image'
import UserHeaderMenu from '../User/HeaderMenu'

import { logout } from '../../redux/store'

class HeaderRegisteredMenu extends Component {
  constructor (props) {
    super(props)

    this.state = { menu: false }
  }

  async toggleMenu (flag) {
    await this.setState(state => { state.menu = flag })
  }

  async logout (e) {
    e.preventDefault()
    await axios.post('/api/auth/logout')

    await this.toggleMenu(false)
    this.props.dispatch(logout())
  }

  render () {
    let { menu } = this.state
    let { className } = this.props

    return (
      <div className={className}>
        <li className='user-menu__item user-menu__item_hoverable'>
          <UserImage small onClick={this.toggleMenu.bind(this, !menu)} />

          <UserHeaderMenu opened={menu} logout={this.logout.bind(this)} onClose={this.toggleMenu.bind(this, false)} />
        </li>
      </div>
    )
  }
}

export default HeaderRegisteredMenu

import axios from 'axios'
import React, { Component } from 'react'

import UserImage from '../User/Image'
import UserHeaderMenu from '../User/HeaderMenu'

import { logout } from '../../redux/auth'

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

  componentWillReceiveProps (nextProps) {}

  render () {
    let { menu } = this.state
    let { className, user } = this.props

    return (
      <div className={[ className ].join(' ')}>
        <li className='user-menu__item user-menu__item_hoverable'>
          <UserImage small user={user} onClick={this.toggleMenu.bind(this, !menu)} />

          <UserHeaderMenu opened={menu} user={user} logout={this.logout.bind(this)} onClose={this.toggleMenu.bind(this, false)} />
        </li>
      </div>
    )
  }
}

export default HeaderRegisteredMenu

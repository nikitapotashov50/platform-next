import React, { Component } from 'react'

import Chat from '../Chat/index'
import UnregisteredMenu from './UnregisteredMenu'
import RegisteredMenu from './RegisteredMenu'

class HeaderRight extends Component {
  constructor (props) {
    super(props)

    this.state = { chatState: false }

    this.toggleChat = this.toggleChat.bind(this)
  }

  toggleChat (flag) {
    return () => {
      this.setState({ chatState: flag })
    }
  }

  render () {
    let { chatState } = this.state
    let { isLogged, dispatch } = this.props

    return (
      <ul className='user-menu'>
        {/* <li className='user-menu__item user-menu__item_no_padding'>
          <a className='user-menu__link user-menu__link_icon user-menu__link_icon_search' />
        </li> */}
        <li className='user-menu__item user-menu__item_no_padding'>
          <a className='user-menu__link user-menu__link_icon user-menu__link_icon_search' onClick={this.toggleChat(!chatState)} />
        </li>

        { isLogged && <RegisteredMenu dispatch={dispatch} className='user-menu__partial' /> }
        { !isLogged && <UnregisteredMenu dispatch={dispatch} className='user-menu__partial' /> }

        { chatState && <Chat /> }
      </ul>
    )
  }
}

export default HeaderRight

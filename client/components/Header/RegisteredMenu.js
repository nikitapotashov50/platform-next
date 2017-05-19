import axios from 'axios'
// import { isEmpty } from 'lodash'
import { connect } from 'react-redux'
import React, { Component } from 'react'

import UserImage from '../User/Image'
import UserHeaderMenu from '../User/HeaderMenu'

import { logout } from '../../redux/auth'
import { changeCurrent as changeCurrentProgram } from '../../redux/user/programs'

class HeaderRegisteredMenu extends Component {
  constructor (props) {
    super(props)

    this.state = { menu: false }
    this.changeProgram = this.changeProgram.bind(this)
  }

  async toggleMenu (flag) {
    await this.setState(state => { state.menu = flag })
  }

  async logout (e) {
    e.preventDefault()
    await axios.post('/api/auth/logout', {}, { withCredentials: true })

    await this.toggleMenu(false)
    this.props.dispatch(logout())
  }

  async changeProgram (e) {
    this.props.dispatch(changeCurrentProgram(e.target.value))
  }

  drawPrograms (items) {
    let result = []
    for (var i in items) {
      result.push(
        <option value={items[i].id} key={'program-' + items[i].id}>{items[i].title}</option>
      )
    }
    return result
  }

  render () {
    let { menu } = this.state
    let {className, user/*, programs */} = this.props // eslint-disable-line standard/object-curly-even-spacing

    return (
      <div className={[ className ].join(' ')}>
        {/* ПЕРЕКЛЮЧАЛКА ПРОГРАММЫ
          { !isEmpty(programs.items) && (
          <li className='user-menu__item user-menu__item_hoverable'>
            <select onChange={this.changeProgram} value={programs.current || ''}>
              {this.drawPrograms(programs.items)}
            </select>
          </li>
        )} */}

        <li className='user-menu__item user-menu__item_hoverable' onClick={this.toggleMenu.bind(this, !menu)}>
          <UserImage small user={user} />

          <UserHeaderMenu opened={menu} user={user} logout={this.logout.bind(this)} onClose={this.toggleMenu.bind(this, false)} />
        </li>
      </div>
    )
  }
}

let mapStateToProps = ({ auth, user }) => ({
  user: auth.user,
  programs: user.programs
})

export default connect(mapStateToProps)(HeaderRegisteredMenu)

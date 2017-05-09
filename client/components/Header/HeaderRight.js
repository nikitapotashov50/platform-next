import { connect } from 'react-redux'

import UnregisteredMenu from './UnregisteredMenu'
import RegisteredMenu from './RegisteredMenu'

const HeaderRight = ({ user, dispatch }) => (
  <ul className='user-menu'>
    <li className='user-menu__item user-menu__item_no_padding'>
      <a className='user-menu__link user-menu__link_icon user-menu__link_icon_search' />
    </li>

    { user && <RegisteredMenu dispatch={dispatch} className='user-menu__partial' /> }
    { !user && <UnregisteredMenu dispatch={dispatch} className='user-menu__partial' /> }
  </ul>
)

let mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps)(HeaderRight)
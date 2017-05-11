import { connect } from 'react-redux'

import UnregisteredMenu from './UnregisteredMenu'
import RegisteredMenu from './RegisteredMenu'

const HeaderRight = ({ isLogged, dispatch }) => (
  <ul className='user-menu'>
    <li className='user-menu__item user-menu__item_no_padding'>
      <a className='user-menu__link user-menu__link_icon user-menu__link_icon_search' />
    </li>

    { isLogged && <RegisteredMenu dispatch={dispatch} className='user-menu__partial' /> }
    { !isLogged && <UnregisteredMenu dispatch={dispatch} className='user-menu__partial' /> }
  </ul>
)

let mapStateToProps = state => ({
  isLogged: state.auth.isLogged
})

export default connect(mapStateToProps)(HeaderRight)

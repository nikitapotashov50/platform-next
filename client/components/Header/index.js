import Menu from '../Menu'
import HeaderRight from './HeaderRight'
import { connect } from 'react-redux'

let menu = [
  { url: '/', title: 'Отчеты', as: '/reports' },
  { url: '/tasks', title: 'Задания' },
  { url: '/ratings', title: 'Рейтинг' }
]

const Header = ({ user, pathname, dispatch, isLogged }) => (
  <header className='app-header noPrint'>
    <div className='app-header__wrap'>

      <div className='app-header__block app-header__block_menu'>
        <Menu items={menu} withLogo pathname={pathname} />
      </div>

      <div className='app-header__block app-header__block_menu'>
        <HeaderRight dispatch={dispatch} user={user} isLogged={isLogged} />
      </div>

    </div>
  </header>
)

const mapStateToProps = state => ({
  user: state.auth.user,
  isLogged: state.auth.isLogged
})

export default connect(mapStateToProps)(Header)

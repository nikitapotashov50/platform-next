import Menu from '../Menu'
import HeaderRight from './HeaderRight'
import { connect } from 'react-redux'

let menu = [
  { url: '/', title: 'Отчеты', as: '/reports' },
  { url: '/tasks', title: 'Задания' },
  { url: '/rating', title: 'Рейтинг' }
]

const Header = ({ user, pathname }) => (
  <header className='app-header noPrint'>
    <div className='app-header__wrap'>

      <div className='app-header__block app-header__block_menu'>
        <Menu items={menu} withLogo pathname={pathname} />
      </div>

      <div className='app-header__block app-header__block_menu'>
        <HeaderRight />
      </div>

    </div>
  </header>
)

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(Header)

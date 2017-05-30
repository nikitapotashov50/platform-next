import Menu from '../Menu'
import HeaderRight from './HeaderRight'
import { connect } from 'react-redux'

let menu = [
  { url: '/', title: 'Отчеты', as: '/', code: 'index' },
  { url: '/tasks', title: 'Задания' }
  // { url: '/ratings', title: 'Рейтинг' }
]

const Header = ({ pathname, dispatch, isLogged }) => (
  <header className='app-header noPrint'>
    <div className='app-header__wrap'>

      <div className='app-header__block app-header__block_menu'>
        <Menu items={menu} selected={'index'} withLogo pathname={pathname} />
      </div>

      <div className='app-header__block app-header__block_menu'>
        <HeaderRight dispatch={dispatch} isLogged={isLogged} />
      </div>

    </div>
  </header>
)

const mapStateToProps = state => ({
  isLogged: state.auth.isLogged
})

export default connect(mapStateToProps)(Header)

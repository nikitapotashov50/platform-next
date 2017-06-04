import Menu from '../Menu'
import HeaderRight from './HeaderRight'
import { connect } from 'react-redux'

let menu = [
  { url: '/', title: 'Отчеты', as: '/', code: 'index' }
  // { url: '/ratings', title: 'Рейтинг' }
]

const Header = ({ pathname, dispatch, isLogged, role, taskCount }) => {
  let addMenu = [
    { url: '/tasks', title: 'Задания', notify: taskCount }
  ]

  if (role === 'volunteer') addMenu.push({ url: '/volunteer', title: 'Волонтерство' })
  return (
    <header className='app-header noPrint'>
      <div className='app-header__wrap'>

        <div className='app-header__block app-header__block_menu'>
          <Menu items={[ ...menu, ...addMenu ]} selected={'index'} withLogo pathname={pathname} />
        </div>

        <div className='app-header__block app-header__block_menu'>
          <HeaderRight dispatch={dispatch} isLogged={isLogged} />
        </div>

      </div>
    </header>
  )
}

const mapStateToProps = ({ auth, user, tasks }) => ({
  isLogged: auth.isLogged,
  taskCount: tasks.items.count,
  role: (user.programs.items ? user.programs.items[user.programs.current].role : null)
})

export default connect(mapStateToProps)(Header)

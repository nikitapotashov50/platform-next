import Menu from '../Menu'
import Logo from './Logo'
import HeaderRight from './HeaderRight'
import { connect } from 'react-redux'

let menu = [
  { url: '/', title: 'Отчеты', as: '/', code: 'index' }
]

const Header = ({ dispatch, current, isLogged, role, selected, taskCount }) => {
  let addMenu = []
  if (isLogged && current !== 3) addMenu.push({ url: '/tasks', as: '/tasks', title: 'Задания', notify: taskCount || false, code: 'tasks' })
  addMenu.push({ url: '/rating', as: '/rating', title: 'Рейтинг', code: 'rating' })
  if (role === 'volunteer') addMenu.push({ url: '/volunteer', as: '/volunteer', title: 'Волонтерство', code: 'volunteer' })

  return (
    <header className='app-header noPrint'>
      <div className='app-header__wrap'>

        <div className='app-header__block app-header__block_menu'>
          <Logo />
          <Menu items={[ ...menu, ...addMenu ]} selected={selected} />
        </div>

        <div className='app-header__block app-header__block_user'>
          <HeaderRight dispatch={dispatch} isLogged={isLogged} />
        </div>

      </div>
    </header>
  )
}

const mapStateToProps = ({ auth, user, tasks }) => {
  let { programs } = user
  let role = (programs.items && programs.current && programs.items[programs.current]) ? user.programs.items[user.programs.current].role : null

  return {
    role,
    current: programs.current,
    isLogged: auth.isLogged,
    taskCount: tasks.items.count
  }
}

export default connect(mapStateToProps)(Header)

import Menu from '../Menu'
import HeaderRight from './HeaderRight'
import { connect } from 'react-redux'

let menu = [
  { url: '/', title: 'Отчеты', as: '/', code: 'index' }
]

const Header = ({ pathname, dispatch, isLogged, role, selected, taskCount }) => {
  let addMenu = []
  if (isLogged) addMenu.push({ url: '/tasks', as: '/tasks', title: 'Задания', notify: taskCount || false, code: 'tasks' })
  if (role === 'volunteer') addMenu.push({ url: '/volunteer', as: '/volunteer', title: 'Волонтерство', code: 'volunteer' })

  return (
    <header className='app-header noPrint'>
      <div className='app-header__wrap'>

        <div className='app-header__block app-header__block_menu'>
          <Menu items={[ ...menu, ...addMenu ]} selected={selected} withLogo pathname={pathname} />
        </div>

        <div className='app-header__block app-header__block_menu'>
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
    isLogged: auth.isLogged,
    taskCount: tasks.items.count
  }
}

export default connect(mapStateToProps)(Header)

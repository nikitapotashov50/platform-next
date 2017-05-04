import Link from 'next/link'
import { connect } from 'react-redux'

const Header = ({ user }) => (
  <header className='app-header noPrint'>
    <div className='app-header__wrap'>

      <div className='app-header__block app-header__block_menu'>

        <ul className='menu'>
          <li className='menu__item menu__item_no_padding-left'>
            <Link href='/'>
              <a className='menu__link'>
                <img src='assets/img/logo.png' alt='Система' style={{ display: 'inline-block', width: '41px', height: '36px' }} />
              </a>
            </Link>
          </li>

          <li className='menu__item'>
            <Link href='/'>
              <a className='menu__link'>Отчеты</a>
            </Link>
          </li>

          { user && (
            <li className='menu__item'>
              <Link href='/'>
                <a className='menu__link'>Задания</a>
              </Link>
            </li>
          )}

          <li className='menu__item'>
            <Link href='/'>
              <a className='menu__link'>Рейтинг</a>
            </Link>
          </li>
        </ul>
      </div>

      <div className='app-header__block app-header__block_menu' />

    </div>
  </header>
)

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(Header)

import Link from 'next/link'
import classNames from 'classnames'

const Menu = ({ items, withLogo = false, pathname }) => (
  <ul className='menu'>
    { withLogo && (
      <li className='menu__item'>
        <Link href='/'>
          <a className='menu__link'>
            <img src='/static/img/logo.png' alt='Система' style={{ display: 'inline-block', width: '41px', height: '36px' }} />
          </a>
        </Link>
      </li>
    )}

    { items.map(el => (
      <li
        className={classNames('menu__item', { active: pathname === el.url })}
        key={'menu-' + el.url}>
        <Link href={el.url} as={el.as} prefetch>
          <a className='menu__link'>{el.title}</a>
        </Link>
      </li>
    ))}

    <style jsx>{`
      .active {
        border-bottom: 2px solid #196aff;
      }
    `}</style>
  </ul>
)

export default Menu

import Link from 'next/link'
import classNames from 'classnames'

const Menu = ({ items, withLogo = false, pathname }) => (
  <ul className='menu'>
    { withLogo && (
      <li className='menu__item  menu__item_no_padding-left'>
        <Link href='/'>
          <a className='menu__link'>
            <img src='/static/img/logo.png' alt='Система' style={{ display: 'inline-block', width: '41px', height: '36px' }} />
          </a>
        </Link>
      </li>
    )}

    { items.map(el => (
      <li
        className={classNames('menu__item', { menu__item_active: pathname === ('/' + el.url) })}
        key={'menu-' + el.url}>
        <Link href={el.url} as={el.as} prefetch>
          <a className={[ 'menu__link', el.notify ? 'menu__link_notify' : '' ].join(' ')}>
            {el.title}
            { el.notify && (<span className='menu__notify'>{el.notify}</span>)}
          </a>
        </Link>
      </li>
    )) }

    <style jsx>{`
      .active {
        border-bottom: 2px solid #196aff;
      }
    `}</style>
  </ul>
)

export default Menu

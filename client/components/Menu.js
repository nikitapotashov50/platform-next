import Link from 'next/link'

const Menu = ({ items, withLogo = false, selected }) => (
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
        className={[ 'menu__item' ].join(' ')}
        key={'menu-' + el.url}>
        <Link href={el.url} as={el.as} prefetch>
          <a className={[ 'menu__link', el.notify ? 'menu__link_notify' : '', selected === el.code ? ' menu__link_active' : '' ].join(' ')}>
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

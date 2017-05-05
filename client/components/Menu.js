import Link from 'next/link'

const Menu = ({ items, withLogo = false }) => (
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
      <li className='menu__item' key={'menu-' + el.url}>
        <Link href={el.url}>
          <a className='menu__link'>{el.title}</a>
        </Link>
      </li>
    ))}
  </ul>
)

export default Menu

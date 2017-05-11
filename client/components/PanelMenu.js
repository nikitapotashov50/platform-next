import Link from 'next/link'

export default ({ items, selected }) => (
  <div className='panel-menu'>
    { items && items.map(el => (
      <div className='panel-menu__item panel-menu__item_bordered' key={'nps-meny-' + el.title}>
        <Link href={el.href} as={el.path}>
          <a className={[ 'panel-menu__link', selected === el.code ? 'panel-menu__link_active' : '' ].join(' ')}>{el.title}</a>
        </Link>
      </div>
    ))}
  </div>
)

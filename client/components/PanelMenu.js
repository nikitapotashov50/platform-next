import Link from 'next/link'

const drawLink = (el, selected) => (
  <a className={[ 'panel-menu__link', selected === el.code ? 'panel-menu__link_active' : '' ].join(' ')} onClick={e => e.preventDefault()}>{el.title}</a>
)

export default ({ items, selected }) => (
  <div className='panel-menu'>
    { items && items.map(el => (
      <div className='panel-menu__item panel-menu__item_bordered' key={'nps-menu-' + el.code}>
        { (el.code !== selected) && (
          <Link href={el.href} as={el.path}>
            {drawLink(el, selected)}
          </Link>
        )}
        { (el.code === selected) && drawLink(el, selected) }
      </div>
    ))}
  </div>
)

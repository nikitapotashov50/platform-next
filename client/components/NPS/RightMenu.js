import Link from 'next/link'

export default ({ items = [], selected }) => (
  <ul className='side-links'>
    { items.length > 0 && items.map(el => (
      <li className={[ 'side-links__item', el.code === selected ? 'side-links__item_active' : '' ].join(' ')} key={'links-menu-' + el.code}>
        { el.code !== selected && (
          <Link href={el.href} as={el.path}>
            <a className='side-links__link'>{el.title}</a>
          </Link>
        )}
        { el.code === selected && (
          <span className='side-links__link'>{el.title}</span>
        )}
      </li>
    ))}

    <style jsx>{`
      .side-links {
        margin: -15px -20px;
      }
      .side-links__item {
        padding: 10px 20px;
      }
      .side-links__item:hover, .side-links__item_active {
        background-color: rgba(0, 0, 0, .05);
      }
      .side-links__link {}
    `}</style>
  </ul>
)

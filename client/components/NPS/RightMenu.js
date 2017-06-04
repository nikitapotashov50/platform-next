import Link from 'next/link'

export default ({ items, selected }) => (
  <ul className='side-links'>
    { items.length && items.map(el => (
      <li className='side-links__item' key={'links-menu-' + el.code}>
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
      .side-links {}
      .side-links__item {
        padding: 7px 0;
      }
      .side-links__link {}
    `}</style>
  </ul>
)

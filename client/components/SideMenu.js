import Link from 'next/link'

export default ({ items, selected, t }) => (
  <ul className='side-links'>
    { items.map(el => (
      <li className={[ 'side-links__item' ]} key={'side-link-' + el.code}>
        <Link href={el.href} as={el.path}>
          { selected === el.code
            ? <span className='side-links__link'>{t('account.settings.' + el.code + '.title')}</span>
            : <a className='side-links__link'>{t('account.settings.' + el.code + '.title')}</a>
          }
        </Link>
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

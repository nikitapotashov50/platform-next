export default ({ items }) => (
  <ul className='side-links'>
    { items.length && items.map(el => (
      <li className='side-links__item' key={'links-menu-' + el.title}>
        <a className='side-links__link' onClick={el.onClick.bind(this, el.code)} href={el.path}>{el.title}</a>
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

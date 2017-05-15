import Link from 'next/link'

export default ({ items, title }) => (
  <div className='user-side-panel'>
    <div className='user-side-panel__title'>{title}</div>

    <div className='user-side-panel__body'>
      <div className='followers-tiles'>

        { items && items.map(user => (
          <Link href={'/user?username=' + user.name} as={'/@' + user.name} key={'user-profile-subscribes-' + user.id}>
            <a className='followers-tiles__item'>
              <div className='followers-tiles__image' data-name={user.first_name + ' ' + user.last_name} style={{ backgroundImage: `url(${user.picture_small})` }} />
            </a>
          </Link>
        )) }

      </div>
    </div>

  </div>
)

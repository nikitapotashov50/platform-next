import Link from 'next/link'

let defaultUsers = [
  { id: 12312, name: 'bm-ksu', first_name: 'Ксения', last_name: 'Прохорова' },
  { id: 12313, name: 'bm-paperdoll', first_name: 'Степан', last_name: 'Юринов' },
  { id: 33333, name: 'bm-ksu', first_name: 'Ксения', last_name: 'Прохорова' },
  { id: 44444, name: 'bm-paperdoll', first_name: 'Степан', last_name: 'Юринов' },
  { id: 55555, name: 'bm-ksu', first_name: 'Ксения', last_name: 'Прохорова' },
  { id: 66666, name: 'bm-paperdoll', first_name: 'Степан', last_name: 'Юринов' }
]

export default ({ items }) => (
  <div className='user-side-panel'>
    <div className='user-side-panel__title'>Подписки</div>

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

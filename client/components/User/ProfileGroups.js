import Link from 'next/link'

let defaultGroups = [
  { id: 123123, title: 'Десятка', image: '' },
  { id: 213123, title: 'Сотня', image: '' },
  { id: 555555, title: 'Полк', image: '' },
  { id: 986876, title: 'Тренерство', image: '' }
]

export default ({ groups = defaultGroups }) => (
  <div className='user-side-panel'>
              
    <h6 className='user-side-panel__title'>Группы</h6>
    <div className='user-side-panel__body'>
      <div className='user-groups'>

        { defaultGroups.map(group => (
          <Link href='/' key={'user-group-' + group.id}>
            <a className='user-groups__item'>
              <img className='user-groups__image' src={group.image} alt={group.title} />
              <span className='user-groups__link'>{group.title}</span>
            </a>
          </Link>
        )) }

      </div>
    </div>

  </div>
)

// import Link from 'next/link'

export default ({ groups }) => (
  <div className='user-side-panel'>

    <h6 className='user-side-panel__title'>Группы</h6>

    <div className='user-side-panel__body'>
      <div className='user-groups'>

        { groups.map(group => (
         // <Link href={'/groups?id=' + group.id} as={'/groups/' + group.id} key={'user-group-' + group.id}>
          <a className='user-groups__item' key={'group-' + group.el}>
            <img className='user-groups__image' src={group.image || '/static/img/logo.png'} alt={group.title} />
            <div className='user-groups__body'>
              <span className='user-groups__link'>{group.title}</span>
            </div>
          </a>
         // </Link>
        )) }

      </div>
    </div>

  </div>
)

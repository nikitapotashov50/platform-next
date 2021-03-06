import Img from 'react-image'
import Link from 'next/link'
import moment from 'moment'
import numeral from 'numeral'

const formatMoney = money => numeral(money).format('0,0')

export default ({ money, subscribeButtons = false, date, user, small, noOccupation }) => {
  let bodyClasses = [ 'user-inline__body' ]

  if (subscribeButtons) bodyClasses.push('user-inline__body_width_thin')

  return (
    <div className='user-inline'>
      { user && (
        <Link prefetch href={'/user?username=' + user.name} as={'/@' + user.name}>
          <a className={[ 'user-inline__image-link', small ? 'user-inline__image-link_small' : '' ].join(' ')}>
            <Img src={[ user.picture_small, '/static/img/user.png' ]} className={[ 'user-inline__image', small ? 'user-inline__image_small' : '' ].join(' ')} alt={`${user.first_name} ${user.last_name}`} />
          </a>
        </Link>
      ) }

      <div className={bodyClasses.join(' ')}>
        <div className='user-inline__title-block'>
          { user && (
            <Link prefetch href={'/user?username=' + user.name} as={'/@' + user.name}>
              <a className='user-inline__title'>{user.first_name + ' ' + (user.last_name || '')}</a>
            </Link>
          )}

          { !user && <span className='user-inline__title'>Annonymous</span>}

          { date && (<span className='user-inline__when'>{ moment(date).from(moment()) }</span>)}
        </div>

        <div className='user-inline__info'>
          { (user && user.occupation && !noOccupation) && user.occupation }
        </div>
      </div>

      { (user && subscribeButtons) && (
        <div className='user-inline__buttons'>
          <button className='myBtn myBtn_small'>Подписаться</button>
          <button className='myBtn myBtn_small'>Заблокировать</button>
        </div>
      )}
      { user && user.money && (<div className='user-inline__money'>{formatMoney(user.money)} ₽</div>)}
    </div>
  )
}

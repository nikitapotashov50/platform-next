import Link from 'next/link'

const formatMoney = money => money

export default ({ money, occupation = 'Огонь свет', subscribeButtons = true, date = '3 lдня назад', fullName = 'Имя Фамилия' }) => {
  let bodyClasses = [ 'user-inline__body' ]

  if (subscribeButtons) bodyClasses.push('user-inline__body_width_thin')

  return (
    <div className='user-inline'>
      <Link href='/bm-paperdoll'>
        <a className='user-inline__image-link'>
          <div className='user-inline__image' src='' alt='' />
        </a>
      </Link>

      <div className={bodyClasses.join(' ')}>
        <div className='user-inline__title-block'>
          <Link href='/bm-paperdoll'>
            <a className='user-inline__title'>{ fullName }</a>
          </Link>

          { date && (<span className='user-inline__when'>{ date }</span>)}
        </div>
        <div className='user-inline__info'>
          {occupation}
        </div>
      </div>

      { subscribeButtons && (
        <div className='user-inline__buttons'>
          <button className='myBtn myBtn_small'>Подписаться</button>
          <button className='myBtn myBtn_small'>Заблокировать</button>
        </div>
      )}

      { money && (<div className='user-inline__money'>{formatMoney(money)} ₽</div>)}
    </div>
  )
}

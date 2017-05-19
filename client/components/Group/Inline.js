import Img from 'react-image'
import Link from 'next/link'
import numeral from 'numeral'

const formatMoney = money => numeral(money).format('0,0')

export default ({ money, picture, title, small, description, link }) => {
  let bodyClasses = [ 'user-inline__body' ]
  let { href, path } = link

  return (
    <div className='user-inline'>

      <Link href={href} as={path}>
        <a className={[ 'user-inline__image-link', small ? 'user-inline__image-link_small' : '' ].join(' ')}>
          <Img src={[ picture, '/static/img/user.png' ]} className={[ 'user-inline__image', small ? 'user-inline__image_small' : '' ].join(' ')} alt={title} />
        </a>
      </Link>

      <div className={bodyClasses.join(' ')}>
        <div className='user-inline__title-block'>
          { title && (
            <Link href={href} as={path}>
              <a className='user-inline__title'>{title}</a>
            </Link>
          )}

          { !title && <span className='user-inline__title'>Annonymous</span>}
        </div>
        <div className='user-inline__info'>
          { description && description }
        </div>
      </div>

      { money && (<div className='user-inline__money'>{formatMoney(money)} ₽</div>)}
    </div>
  )
}

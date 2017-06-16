import moment from 'moment'
import { pick, transform } from 'lodash'

const pickInfo = (obj, fields) => transform(pick(obj || {}, fields), (result, value, key) => {
  result.push({ type: key, value })
}, []).filter(x => !!x.value)

const getStatus = (status, gender = null) => {
  if (status === 'single') return gender ? (gender === 'male' ? 'Свободен' : 'Свободна') : 'Не в отношениях'
  if (status === 'couple') return 'В отношениях'
  if (status === 'married') return gender ? (gender === 'male' ? 'Женат' : 'Замужем') : 'Женат / Замужем'
}

export default ({ info = {}, user = {}, goal = {}, balance = null }) => {
  let badgeInfo = []
  if (info && info.birthday) badgeInfo.push(Math.floor(moment(new Date()).diff(moment(info.birthday), 'years', true)) + ' лет')
  if (info && info.social_status) badgeInfo.push(getStatus(info.social_status, info.gender))
  // if (city) badgeInfo.push(city)
  let contacts = pickInfo(info, [ 'vk', 'facebook', 'instagram', 'website' ])

  return (
    <div className='user-badge'>
      <h2 className='user-badge__name'>{user.first_name} {user.last_name}</h2>
      {/* user && user.name */}
      <div className='user-badge__info'>
        { (badgeInfo.length > 0) && badgeInfo.join(', ')}
      </div>
      { !!goal && <div className='user-badge__info'>{goal.occupation}</div> }

      { contacts.length > 0 && (
        <div>
          { contacts.map(el => (
            el.type === 'vk' ? (<a href={el.value} target='_blank' className='user-badge__info-link user-badge__info-vk' key={el.type} />)
            : el.type === 'facebook' ? (<a href={el.value} target='_blank' className='user-badge__info-link user-badge__info-facebook' key={el.type} />)
            : el.type === 'instagram' ? (<a href={el.value} target='_blank' className='user-badge__info-link user-badge__info-instagram' key={el.type} />)
            : el.type === 'website' ? (<a href={el.value} target='_blank' className='user-badge__info-website' key={el.type}>{el.value}</a>) : ''
          ))}
        </div>
      )}

      { balance && (<div>{Number(balance).toFixed(2)} BMT</div>)}
    </div>
  )
}

import moment from 'moment'
import { pick, transform } from 'lodash'

const pickInfo = (obj, fields) => transform(pick(obj || {}, fields), (result, value, key) => {
  result.push({ type: key, value })
}, []).filter(x => !!x.value)

const getStatus = (status, gender = null) => {
  if (status === 'single') return 'В поиске'
  if (status === 'couple') return 'В отношениях'
  if (status === 'married') return gender ? (gender === 'male' ? 'Женат' : 'Замужем') : 'Женат / Замужем'
}

export default ({ info = {}, user = {}, goal = {} }) => {
  let badgeInfo = []
  if (info && info.birthday) badgeInfo.push(Math.floor(moment(new Date()).diff(moment(info.birthday), 'years', true)) + ' лет')
  if (info && info.social_status) badgeInfo.push(getStatus(info.social_status, info.gender))
  // if (city) badgeInfo.push(city)
  let contacts = pickInfo(info, [ 'vk', 'facebook', 'instagram', 'website' ])

  return (
    <div className='user-badge'>
      <h2 className='user-badge__name'>{user.first_name} {user.last_name}</h2>
      <div className='user-badge__info'>
        { (badgeInfo.length > 0) && badgeInfo.join(', ')}
      </div>
      { !!goal && <div className='user-badge__info'>{goal.occupation}</div> }

      { contacts.length > 0 && (
        <div>
          { contacts.map(el => (
            <div key={el.type}>{el.type}: {el.value}</div>
          ))}
        </div>
      )}
    </div>
  )
}

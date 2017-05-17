import moment from 'moment'

export default ({ birthday, city, occupation, ...props }) => {
  let badgeInfo = []
  if (birthday) badgeInfo.push(Math.floor(moment(new Date()).diff(moment(birthday), 'years', true)) + ' лет')
  if (city) badgeInfo.push(city)

  return (
    <div className='user-badge'>
      <h2 className='user-badge__name'>{props.first_name} {props.last_name}</h2>
      <div className='user-badge__info'>
        { (badgeInfo.length > 0) && badgeInfo.join(', ')}
      </div>
      { occupation && <div className='user-badge__info'>{occupation}</div> }
    </div>
  )
}

import moment from 'moment'

export default ({ first_name, last_name, birthday, occupation = 'Машинная вышивка(нашивки, картины), дизайн-интерьеров, картины.' }) => {
  let age
  if (birthday) age = moment(birthday).month(0).from(moment().month(0))

  return (
    <div className='user-badge'>
      <h2 className='user-badge__name'>{first_name} {last_name}</h2>
      <div className='user-badge__info'>
        { age && (age) }
        , Екатеринбург
      </div>
      { occupation && <div className='user-badge__info'>{occupation}</div> }
    </div>
  )
}

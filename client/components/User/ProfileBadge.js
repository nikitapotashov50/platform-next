import moment from 'moment'

export default ({ birthday, occupation = 'Машинная вышивка(нашивки, картины), дизайн-интерьеров, картины.', ...props }) => {
  let age
  if (birthday) age = moment(birthday).month(0).from(moment().month(0))

  let firstName = props.first_name
  let lastName = props.last_name

  return (
    <div className='user-badge'>
      <h2 className='user-badge__name'>{firstName} {lastName}</h2>
      <div className='user-badge__info'>
        { age && (age) }
        , Екатеринбург
      </div>
      { occupation && <div className='user-badge__info'>{occupation}</div> }
    </div>
  )
}

const changeValue = (field, cb, e) => {
  if ([ 'content' ].indexOf(field) < 0) return

  let value = e.target.value.replace(/(<([^>]+)>)/ig, '')

  return cb(field, value)
}

const DefaultReply = ({ errors, affected, onChange }) => (
  <form className='panel-form'>
    <div className='panel-form__row'>
      <label className='panel-form__label'>Ответ на задание</label>
      <textarea className='panel-form__input panel-form__input_textarea' type='text' value={affected.content || ''} onChange={changeValue.bind(this, 'content', onChange)} />
      { errors.content && <div className='panel-form__error'>{errors.content}</div> }
    </div>
  </form>
)

DefaultReply.title = 'Ответ на задание'

DefaultReply.validate = (data, errors = {}) => {
  if (!data.content || !data.content.length) errors.content = 'Напишите ответ на задание'
  return errors
}

export default DefaultReply

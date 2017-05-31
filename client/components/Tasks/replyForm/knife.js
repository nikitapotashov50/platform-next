import numeral from 'numeral'

/**
 * цель в деньгах
 * цена слова
 * целевое действие на неделю
 */
const isUndef = value => (typeof value === 'undefined')

const changeValue = (field, cb, e) => {
  if ([ 'goal', 'action', 'price' ].indexOf(field) < 0) return

  let value = e.target.value.replace(/(<([^>]+)>)/ig, '')
  if ([ 'goal' ].indexOf(field) > -1) value = value.replace(/[^0-9]+/g, '')

  return cb(field, value)
}

const TaskReplyForm = ({ errors, affected, onChange }) => {
  let goal = isUndef(affected.goal) ? 0 : affected.goal

  return (
    <form className='panel-form'>
      <div className='panel-form__row'>
        <label className='panel-form__label' htmlFor='knife-action'>Целевое действие на неделю</label>
        <textarea className='panel-form__input panel-form__input_textarea' id='knife-action' value={affected.action || ''} onChange={changeValue.bind(this, 'action', onChange)} type='text' />
        { errors.action && <div className='panel-form__error'>{errors.action}</div> }
      </div>
      <div className='panel-form__row'>
        <label className='panel-form__label' htmlFor='knife-goal'>Цель в деньгах</label>
        <input className='panel-form__input panel-form__input_textarea' id='knife-goal' value={numeral(goal || 0).format('0,0')} onChange={changeValue.bind(this, 'goal', onChange)} type='text' />
        { errors.goal && <div className='panel-form__error'>{errors.goal}</div> }
      </div>
      <div className='panel-form__row'>
        <label className='panel-form__label' htmlFor='knife-price'>Цена слова</label>
        <input className='panel-form__input panel-form__input_textarea' id='knife-price' value={affected.price || ''} onChange={changeValue.bind(this, 'price', onChange)} type='text' />
        { errors.price && <div className='panel-form__error'>{errors.price}</div> }
      </div>
    </form>
  )
}

TaskReplyForm.title = 'Поставьте план-кинжал на неделю'

TaskReplyForm.validate = (data, errors = {}) => {
  if (!data.goal) errors.goal = 'Укажите свою цель в деньгах'
  if (Number(data.goal) > 1000000000) errors.goal = 'Да вы охренели'
  if (!data.price || !data.price.length) errors.price = 'Укажите цену слова'
  if (!data.action || !data.action.length) errors.action = 'Укажите целевое действие'

  return errors
}

export default TaskReplyForm

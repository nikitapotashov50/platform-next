import numeral from 'numeral'

/**
 * цель в деньгах
 * цена слова
 * целевое действие на неделю
 */
const isUndef = value => (typeof value === 'undefined')

const changeValue = (field, cb, e) => {
  if ([ 'fact', 'action' ].indexOf(field) < 0) return

  let value = e.target.value.replace(/(<([^>]+)>)/ig, '')
  if ([ 'fact' ].indexOf(field) > -1) value = value.replace(/[^0-9]+/g, '')

  return cb(field, value)
}

const TaskReportForm = ({ errors, affected, onChange }) => {
  let fact = isUndef(affected.fact) ? 0 : affected.fact

  return (
    <form className='panel-form'>
      <div className='panel-form__row'>
        <label className='panel-form__label'>Факт в деньгах</label>
        <input className='panel-form__input panel-form__input_textarea' value={numeral(Number(fact) || 0).format('0,0')} onChange={changeValue.bind(this, 'fact', onChange)} type='text' />
        { errors.fact && <div className='panel-form__error'>{errors.fact}</div> }
      </div>
      <div className='panel-form__row'>
        <label className='panel-form__label'>Ключевое действие, которое принесло вам деньги</label>
        <textarea className='panel-form__input panel-form__input_textarea' value={affected.action || ''} onChange={changeValue.bind(this, 'action', onChange)} />
        { errors.action && <div className='panel-form__error'>{errors.action}</div> }
      </div>
    </form>
  )
}

TaskReportForm.title = 'Отчитайтесь по плану-кинжалу'

TaskReportForm.validate = (data, errors = {}) => {
  if (isUndef(data.fact)) errors.fact = 'Укажите свой факт за неделю в деньгах'
  if (!data.action || !data.action.length) errors.action = 'Укажите ключевое действие'

  return errors
}

export default TaskReportForm

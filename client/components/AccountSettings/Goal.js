import numeral from 'numeral'

const isUndef = value => (typeof value === 'undefined')

const changeValue = (field, cb, e) => {
  if ([ 'a', 'b', 'occupation' ].indexOf(field) < 0) return

  let value = e.target.value.replace(/(<([^>]+)>)/ig, '')
  if ([ 'a', 'b' ].indexOf(field) > -1) value = value.replace(/[^0-9]+/g, '')
  if (field === 'occupation') value = value.replace(/(<([^>]+)>)/ig, '')

  return cb(field, value)
}

const GoalSettings = ({ t, errors, data, affected, onChange }) => {
  let a = isUndef(affected.a) ? data.a : affected.a
  let b = isUndef(affected.b) ? data.b : affected.b

  return (
    <form className='panel-form'>
      <div className='panel-form__row'>
        <label className='panel-form__label'>{t('account.settings.goal.fields.occupation')}</label>
        <textarea className='panel-form__input panel-form__input_textarea' value={isUndef(affected.occupation) ? data.occupation || '' : affected.occupation} onChange={changeValue.bind(this, 'occupation', onChange)} type='text' />
        { errors.occupation && <div className='panel-form__error'>{errors.occupation}</div> }
      </div>
      <div className='panel-form__row'>
        <label className='panel-form__label'>{t('account.settings.goal.fields.a')}</label>
        <input className='panel-form__input' value={numeral(a || 0).format('0,0')} type='text' onChange={changeValue.bind(this, 'a', onChange)} />
        { errors.a && <div className='panel-form__error'>{errors.a}</div> }
      </div>
      <div className='panel-form__row'>
        <label className='panel-form__label'>{t('account.settings.goal.fields.b')}</label>
        <input className='panel-form__input' value={numeral(b || 0).format('0,0')} type='text' onChange={changeValue.bind(this, 'b', onChange)} />
        { errors.b && <div className='panel-form__error'>{errors.b}</div> }
      </div>
    </form>
  )
}

GoalSettings.validate = data => {
  let errors = []

  if (!data.a) errors.push({ field: 'a', message: 'Укажите точку А' })
  if (!data.b) errors.push({ field: 'b', message: 'Укажите точку Б' })
  if (!data.occupation || !data.occupation.length) errors.push({ field: 'occupation', message: 'Укажите свою нишу' })
  if (parseInt(data.a) > parseInt(data.b)) errors.push({ field: 'a', message: 'Точка A не может быть больше точки Б' })

  return errors.reduce((obj, item) => {
    obj[item.field] = item.message
    return obj
  }, {})
}

export default GoalSettings

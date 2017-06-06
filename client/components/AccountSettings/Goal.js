import numeral from 'numeral'
import Form from '../../elements/PanelForm'

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
      <Form.Block id={'goal-occupation'} error={errors.occupation} value={isUndef(affected.occupation) ? data.occupation || '' : affected.occupation} onChange={changeValue.bind(this, 'occupation', onChange)} label={t('account.settings.goal.fields.occupation')} textarea />
      <Form.Block id={'goal-a'} error={errors.a} value={numeral(a || 0).format('0,0')} type='text' onChange={changeValue.bind(this, 'a', onChange)} label={t('account.settings.goal.fields.a')} />
      <Form.Block id={'goal-b'} error={errors.b} value={numeral(b || 0).format('0,0')} type='text' onChange={changeValue.bind(this, 'b', onChange)} label={t('account.settings.goal.fields.b')} />
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

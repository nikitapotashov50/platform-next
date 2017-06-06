import numeral from 'numeral'
import Form from '../../../elements/PanelForm/index'

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
      <Form.Block label='Целевое действие на неделю' id='knife-action' value={affected.action || ''} error={errors.action} onChange={changeValue.bind(this, 'action', onChange)} textarea />
      <Form.Block label='Цель в деньгах' id='knife-goal' value={numeral(goal || 0).format('0,0')} error={errors.goal} onChange={changeValue.bind(this, 'goal', onChange)} />
      <Form.Block label='Цена слова' id='knife-price' value={affected.price || ''} error={errors.price} onChange={changeValue.bind(this, 'price', onChange)} />
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

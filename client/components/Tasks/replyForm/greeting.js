import numeral from 'numeral'
import { pick } from 'lodash'
import Form from '../../../elements/PanelForm/index'

/**
 * цель в деньгах
 * цена слова
 * целевое действие на неделю
 */
const fields = [ 'a', 'b', 'occupation', 'x10', 'dream', 'pq', 'pie', 'need', 'dream_artifact', 'week_action', 'week_money' ]
const isUndef = value => (typeof value === 'undefined')

const changeValue = (field, cb, e) => {
  if (fields.indexOf(field) === -1) return

  let value = e.target.value.replace(/(<([^>]+)>)/ig, '')
  if ([ 'a', 'b', 'x10' ].indexOf(field) > -1) value = value.replace(/[^0-9]+/g, '')

  return cb(field, value)
}

const TaskReportForm = ({ errors, affected, onChange }) => {
  let x10 = isUndef(affected.x10) ? 0 : affected.x10
  let a = isUndef(affected.a) ? 0 : affected.a
  let b = isUndef(affected.b) ? 0 : affected.b
  let weekMoney = isUndef(affected.week_money) ? 0 : affected.week_money

  return (
    <form className='panel-form'>
      <Form.Block label='Ниша' id='greet-occupation' error={errors.occupation} value={affected.occupation || ''} onChange={changeValue.bind(this, 'occupation', onChange)} />
      <Form.Block label='Ваша точка А умноженная на 10' id='greet-x10' error={errors.x10} value={numeral(x10 || 0).format('0,0')} numeric onChange={changeValue.bind(this, 'x10', onChange)} />
      <Form.Block label='Ваша мечта' id='greet-dream' error={errors.dream} value={affected.dream || ''} onChange={changeValue.bind(this, 'dream', onChange)} textarea />

      <Form.Block label='Ваша точка А' id='greet-a' error={errors.a} value={numeral(a || 0).format('0,0')} numeric onChange={changeValue.bind(this, 'a', onChange)} />
      <Form.Block label='Ваша точка Б' id='greet-b' error={errors.b} value={numeral(b || 0).format('0,0')} numeric onChange={changeValue.bind(this, 'b', onChange)} />
      <Form.Block label='Артефакт точки Б' id='greet-dream-artifact' error={errors.dream_artifact} value={affected.dream_artifact || ''} onChange={changeValue.bind(this, 'dream_artifact', onChange)} textarea />

      <Form.Block label='Декомпозиция P x Q' id='greet-pq' error={errors.pq} value={affected.pq || ''} onChange={changeValue.bind(this, 'pq', onChange)} textarea />

      <Form.Block label='Денги на неделю' id='greet-week_money' error={errors.week_money} value={numeral(weekMoney || 0).format('0,0')} numeric onChange={changeValue.bind(this, 'week_money', onChange)} />
      <Form.Block label='Действия на неделю' id='greet-week_action' error={errors.week_action} value={affected.week_action || ''} onChange={changeValue.bind(this, 'week_action', onChange)} textarea />
    </form>
  )
}

TaskReportForm.title = '6 шагов к успеху'

TaskReportForm.getData = specific => pick(specific, fields)

TaskReportForm.validate = (data = {}, errors = {}) => {
  if (!data.occupation || !data.occupation.length) errors.occupation = 'Укажите свою нишу'
  if (!data.x10) errors.x10 = 'Укажите свою точку Б x10'
  if (!data.dream) errors.dream = 'Расскажите о своей мечте'
  if (!data.dream_artifact) errors.dream_artifact = 'Расскажите об артефакте мечты'

  if (!data.a) errors.a = 'Укажите точку А'
  if (!data.b) errors.b = 'Укажите точку Б'
  if (data.a && data.b && parseInt(data.a) > parseInt(data.b)) errors.a = 'Точка A не может быть больше точки Б'

  if (!data.pq || !data.pq.length) errors.pq = 'Укажите декомпозицию точки Б'

  if (!data.week_money) errors.week_money = 'Укажите план в денгах на неделю'
  if (!data.week_action) errors.week_action = 'Укажите свои планируемые действия на неделю'

  return errors
}

export default TaskReportForm

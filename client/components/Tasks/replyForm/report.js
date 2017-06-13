import numeral from 'numeral'
import { pick } from 'lodash'
import Form from '../../../elements/PanelForm/index'

/**
 * цель в деньгах
 * цена слова
 * целевое действие на неделю
 */
const isUndef = value => (typeof value === 'undefined')

const changeValue = (field, cb, e) => {
  if ([ 'fact', 'action', 'content' ].indexOf(field) < 0) return

  let value = e.target.value.replace(/(<([^>]+)>)/ig, '')
  if ([ 'fact' ].indexOf(field) > -1) value = value.replace(/[^0-9]+/g, '')

  return cb(field, value)
}

const TaskReportForm = ({ errors, affected, onChange }) => {
  let fact = isUndef(affected.fact) ? 0 : affected.fact

  return (
    <form className='panel-form'>
      <Form.Block label='Факт в деньгах' error={errors.fact} value={numeral(Number(fact) || 0).format('0,0')} onChange={changeValue.bind(this, 'fact', onChange)} />
      <Form.Block label='Ключевое действие, которое принесло вам деньги' error={errors.action} value={affected.action || ''} onChange={changeValue.bind(this, 'action', onChange)} />
      <Form.Block label='Ваш инсайт или рассказ о выполнении задания' id='knife-insite' value={affected.content || ''} error={errors.content} onChange={changeValue.bind(this, 'content', onChange)} textarea />
    </form>
  )
}

TaskReportForm.title = 'Отчитайтесь по плану-кинжалу'

TaskReportForm.getData = specific => pick(specific, [ 'fact', 'action', 'content' ])

TaskReportForm.validate = (data, errors = {}) => {
  if (isUndef(data.fact)) errors.fact = 'Укажите свой факт за неделю в деньгах'
  if (!data.action || !data.action.length) errors.action = 'Укажите ключевое действие'
  if (!data.attachments || !data.attachments.length) errors.attachments = 'Приложите доказательства'

  return errors
}

export default TaskReportForm

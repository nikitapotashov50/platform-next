import numeral from 'numeral'

const isUndef = value => (typeof value === 'undefined')

const GoalSettings = ({ t, errors, data, affected, fetching, onChange }) => {
  let a = isUndef(affected.a) ? data.a : affected.a
  let b = isUndef(affected.b) ? data.b : affected.b

  return (
    <form className='panel-form'>
      <div className='panel-form__row'>
        <label className='panel-form__label'>{t('account.settings.goal.fields.occupation')}</label>
        <textarea className='panel-form__input panel-form__input_textarea' value={isUndef(affected.occupation) ? data.occupation || '' : affected.occupation} onChange={onChange.bind(this, 'occupation')} type='text' />
        { errors.occupation && <div className='panel-form__error'>{errors.occupation}</div> }
      </div>
      <div className='panel-form__row'>
        <label className='panel-form__label'>{t('account.settings.goal.fields.a')}</label>
        <input className='panel-form__input' value={numeral(a).format('0,0')} type='text' onChange={onChange.bind(this, 'a')} />
        { errors.a && <div className='panel-form__error'>{errors.a}</div> }
      </div>
      <div className='panel-form__row'>
        <label className='panel-form__label'>{t('account.settings.goal.fields.b')}</label>
        <input className='panel-form__input' value={numeral(b).format('0,0')} type='text' onChange={onChange.bind(this, 'b')} />
        { errors.b && <div className='panel-form__error'>{errors.b}</div> }
      </div>
    </form>
  )
}

export default GoalSettings

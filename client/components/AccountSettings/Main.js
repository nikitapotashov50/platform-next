import { isUndefined } from 'lodash'
import moment from 'moment'

import DateInput from '../Common/dateInput'

export default ({ user, t, onChange, affected, errors }) => (
  <form className='panel-form'>
    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.main.fields.last_name')}</label>
      <input className='panel-form__input' value={isUndefined(affected.last_name) ? user.last_name || '' : affected.last_name} onChange={onChange.bind(this, 'last_name')} type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.main.fields.first_name')}</label>
      <input className='panel-form__input' value={isUndefined(affected.first_name) ? user.first_name || '' : affected.first_name} onChange={onChange.bind(this, 'first_name')} type='text' />
    </div>

    {/* <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.main.fields.city')}</label>
      <input className='panel-form__input' value={isUndefined} type='text' />
    </div> */}

    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.main.fields.birthday')}</label>
      <DateInput className='panel-form__input' value={isUndefined(affected.birthday) ? moment(user.birthday).format('DD MM YYYY') || '' : affected.birthday} onChange={onChange.bind(this, 'birthday')} />
      { errors.birthday && <div className='panel-form__error'>{errors.birthday}</div> }
    </div>
  </form>
)

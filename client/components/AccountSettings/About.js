import { isUndefined } from 'lodash'

export default ({ user, t, affected, onChange }) => (
  <form className='panel-form'>
    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.about.fields.about')}</label>
      <textarea className='panel-form__input panel-form__input_textarea' value={isUndefined(affected.about) ? user.about || '' : affected.about} onChange={onChange.bind(this, 'about')} type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.about.fields.hobbi')}</label>
      <textarea className='panel-form__input panel-form__input_textarea' value={isUndefined(affected.hobbies) ? user.hobbies || '' : affected.hobbies} onChange={onChange.bind(this, 'hobbies')} type='text' />
    </div>
  </form>
)

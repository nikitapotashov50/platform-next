import { isUndefined } from 'lodash'

export default ({ user, t, affected, onChange }) => (
  <form className='panel-form'>
    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.about.fields.gender')}</label>
      <select value={isUndefined(affected.gender) ? user.gender || '' : affected.gender} onChange={onChange.bind(this, 'gender')}>
        <option value={null}>Не указан</option>
        <option value={'male'}>Мужчина</option>
        <option value={'feemale'}>Женщина</option>
      </select>
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.about.fields.social_status')}</label>
      <select value={isUndefined(affected.social_status) ? user.social_status || '' : affected.social_status} onChange={onChange.bind(this, 'social_status')}>
        <option value={null}>Не указано</option>
        <option value={'single'}>В поиске</option>
        <option value={'couple'}>В отношениях</option>
        <option value={'married'}>Женат / Замужем</option>
      </select>
    </div>

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

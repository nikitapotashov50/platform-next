export default ({ user, t, onChange, affected }) => (
  <form className='panel-form'>
    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.main.fields.last_name')}</label>
      <input className='panel-form__input' value={affected.last_name || user.last_name} onChange={onChange.bind(this, 'last_name')} type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.main.fields.first_name')}</label>
      <input className='panel-form__input' value={(typeof affected.first_name !== 'undefined') ? affected.first_name : user.first_name} onChange={onChange.bind(this, 'first_name')} type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.main.fields.city')}</label>
      <input className='panel-form__input' type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.main.fields.birthday')}</label>
      <input className='panel-form__input' value={user.birthday} type='text' />
    </div>
  </form>
)

export default ({ user, t, affected, onChange }) => (
  <form className='panel-form'>
    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.contacts.fields.website')}</label>
      <input className='panel-form__input' value={affected.website || user.website} onChange={onChange.bind(this, 'website')} type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.contacts.fields.phone')}</label>
      <input className='panel-form__input' value={affected.phone || user.phone} onChange={onChange.bind(this, 'phone')} type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.contacts.fields.vk')}</label>
      <input className='panel-form__input' value={affected.vk || user.vk} onChange={onChange.bind(this, 'vk')} type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.contacts.fields.facebook')}</label>
      <input className='panel-form__input' value={affected.facebook || user.facebook} onChange={onChange.bind(this, 'facebook')} type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.contacts.fields.instagram')}</label>
      <input className='panel-form__input' value={affected.instagram || user.instagram} onChange={onChange.bind(this, 'instagram')} type='text' />
    </div>
  </form>
)

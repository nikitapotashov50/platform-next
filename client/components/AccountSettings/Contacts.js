export default ({ user, t }) => (
  <form className='panel-form'>
    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.tab.contacts.fields.website')}</label>
      <input className='panel-form__input' type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.tab.contacts.fields.phone')}</label>
      <input className='panel-form__input' type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.tab.contacts.fields.vk')}</label>
      <input className='panel-form__input' type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.tab.contacts.fields.facebook')}</label>
      <input className='panel-form__input' type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.tab.contacts.fields.instagram')}</label>
      <input className='panel-form__input' type='text' />
    </div>
  </form>
)

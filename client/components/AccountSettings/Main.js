export default ({ user, t }) => (
  <form className='panel-form'>
    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.tab.main.last_name')}</label>
      <input className='panel-form__input' value={user.lastName} type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.tab.main.first_name')}</label>
      <input className='panel-form__input' value={user.firstName} type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.tab.main.city')}</label>
      <input className='panel-form__input' type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.tab.main.birthday')}</label>
      <input className='panel-form__input' value={user.birthday} type='text' />
    </div>
  </form>
)

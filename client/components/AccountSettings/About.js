export default ({ user, t }) => (
  <form className='panel-form'>
    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.tab.goal.fields.about')}</label>
      <textarea className='panel-form__input' type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.tab.goal.fields.hobbi')}</label>
      <textarea className='panel-form__input' type='text' />
    </div>
  </form>
)

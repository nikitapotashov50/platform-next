const GoalSettings = ({ t, data, affected, fetching, onChange }) => (
  <form className='panel-form'>
    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.goal.fields.occupation')}</label>
      <input className='panel-form__input' value={data.occupation || ''} type='text' />
    </div>
    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.goal.fields.a')}</label>
      <input className='panel-form__input' value={data.a} type='text' />
    </div>
    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.goal.fields.b')}</label>
      <input className='panel-form__input' value={data.b} type='text' />
    </div>
    {/* <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.tab.goal.fields.category')}</label>
      <input className='panel-form__input' type='text' />
    </div>
    <div className='panel-form__row'>
      <label className='panel-form__label'>{t('account.settings.tab.goal.fields.date')}</label>
      <input className='panel-form__input' type='text' />
    </div> */}
  </form>
)

export default GoalSettings

export default ({ user, t }) => (
  <form className='panel-form'>
    <div className='panel-form__row'>
      <label className='panel-form__label'>Я хочу</label>
      <textarea className='panel-form__input' value={user.website} type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>Я могу</label>
      <textarea className='panel-form__input' value={user.instagram} type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>Мои хобби</label>
      <textarea className='panel-form__input' value={user.facebook} type='text' />
    </div>
  </form>
)

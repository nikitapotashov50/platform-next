export default ({ user, t }) => (
  <form className='panel-form'>
    <div className='panel-form__row'>
      <label className='panel-form__label'>Сайт</label>
      <input className='panel-form__input' value={user.website} type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>Instagram</label>
      <input className='panel-form__input' value={user.instagram} type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>Facebook</label>
      <input className='panel-form__input' value={user.facebook} type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>Vk</label>
      <input className='panel-form__input' value={user.vk} type='text' />
    </div>
  </form>
)

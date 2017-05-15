export default ({ user }) => (
  <form className='panel-form'>
    <div className='panel-form__row'>
      <label className='panel-form__label'>Фамилия</label>
      <input className='panel-form__input' value={user.lastName} type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>Имя</label>
      <input className='panel-form__input' value={user.firstName} type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>Город</label>
      <input className='panel-form__input' type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>Дата рождения</label>
      <input className='panel-form__input' value={user.birthday} type='text' />
    </div>

    <div className='panel-form__row'>
      <label className='panel-form__label'>Ниша</label>
      <input className='panel-form__input' value={user.occupation} type='text' />
    </div>
  </form>
)

const AuthSignup = ({ errors, submit, values, onInput }) => (
  <div className='login-form'>
    <h3 className='login-form__title'>Регистрация</h3>

    <form autoComplete='off'>
      <div className='login-form__row'>
        <label className='login-form__label'>email</label>
        <input className='login-form__input' value={values.email} onChange={onInput.bind(this, 'email')} type='text' />
        { errors.email && (<div>{errors.email}</div>)}
      </div>

      <div className='login-form__row'>
        <label className='login-form__label'>Имя</label>
        <input className='login-form__input' value={values.firstName} onChange={onInput.bind(this, 'firstName')} type='text' />
        { errors.firstName && (<div>{errors.firstName}</div>)}
      </div>

      <div className='login-form__row'>
        <label className='login-form__label'>Фамилия</label>
        <input className='login-form__input' value={values.lastName} onChange={onInput.bind(this, 'lastName')} type='text' />
        { errors.lastName && (<div>{errors.lastName}</div>)}
      </div>

      <div className='login-form__row login-form__row_double-margin'>
        <button className='login-form__btn' type='submit' onClick={submit}>Зарегистрироваться</button>
      </div>
    </form>

    <div className='login-form__row'>Условия и тд</div>
  </div>
)

export default AuthSignup

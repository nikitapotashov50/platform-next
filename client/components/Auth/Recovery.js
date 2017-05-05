const AuthRecovery = ({ loginSwitch, values, onInput, submit, errors }) => (
  <div className='login-form'>
    <h3 className='login-form__title'>Восстановление пароля</h3>

    <div className='alert alert_success'>Ссылка отправлена вам на почту</div>

    <form autoComplete='off' method='post'>

      <div className='login-form__row'>
        <label className='login-form__label'>Email</label>
        <input className='login-form__input' value={values.email} onChange={onInput.bind(this, 'email')} type='text' placeholder='enter_username' />
        { errors.email && (<div>{errors.email}</div>)}
      </div>

      <div className='login-form__row login-form__row_double-margin'>
        <button className='login-form__btn' type='submit' onClick={submit}>Восстановить</button>
      </div>

      <div className='login-form__row login-form__row_centered'>
        <a className='login-form__link' onClick={loginSwitch} href='#'>Войти</a>
      </div>

    </form>
  </div>
)

export default AuthRecovery

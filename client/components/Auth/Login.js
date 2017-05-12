const AuthLogin = ({ recoverySwitch, values, onInput, errors, submit, fetching }) => (
  <div className='login-form'>
    <h3 className='login-form__title'>Авторизация</h3>

    <form method='post'>
      <div className='login-form__row'>
        <label className='login-form__label'>Логин</label>
        <input className='login-form__input' value={values.email} onChange={onInput.bind(this, 'email')} type='text' autoComplete='on' />
        { errors.email && (<div>{errors.email}</div>)}
      </div>

      <div className='login-form__row'>
        <label className='login-form__label'>Пароль</label>
        <input className='login-form__input' value={values.password} onChange={onInput.bind(this, 'password')} type='password' />
        { errors.password && (<div>{errors.password}</div>)}
      </div>

      { errors.fetching && <div >{errors.fetching}</div>}

      <div className='login-form__row login-form__row_double-margin'>
        <button className='login-form__btn' type='submit' onClick={submit}>{ fetching ? 'Загрузка' : 'Войти' }</button>
      </div>

      <div className='login-form__row login-form__row_centered'>
        <a className='login-form__link' href='#' onClick={recoverySwitch}>Восстановить пароль</a>
      </div>
      <div className='login-form__row login-form__row_centered'>
        <div className='LoginForm__label-support'>Текст всякий <a href='mailto:help@molodost.bz'>help@molodost.bz</a></div>
      </div>
    </form>
  </div>
)

export default AuthLogin

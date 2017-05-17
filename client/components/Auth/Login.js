import { translate } from 'react-i18next'

const AuthLogin = ({ recoverySwitch, values, onInput, errors, submit, fetching, t }) => (
  <div className='login-form'>
    <h3 className='login-form__title'>{t('auth.login.title')}</h3>

    <form method='post'>
      <div className='login-form__row'>
        <label className='login-form__label'>{t('auth.login.fields.email')}</label>
        <input className='login-form__input' value={values.email} placeholder={t('auth.login.placeholders.email')} name='platform_email' onChange={onInput.bind(this, 'email')} type='text' autoComplete='on' />
        { errors.email && (<div>{errors.email}</div>)}
      </div>

      <div className='login-form__row'>
        <label className='login-form__label'>{t('auth.login.fields.password')}</label>
        <input className='login-form__input' value={values.password} placeholder={t('auth.login.placeholders.email')} onChange={onInput.bind(this, 'password')} type='password' />
        { errors.password && (<div>{errors.password}</div>)}
      </div>

      { errors.fetching && <div >{errors.fetching}</div>}

      <div className='login-form__row login-form__row_double-margin'>
        <button className='login-form__btn' type='submit' onClick={submit}>{t('auth.login.submit')}</button>
      </div>

      <div className='login-form__row login-form__row_centered'>
        <a className='login-form__link' href='#' onClick={recoverySwitch}>{t('auth.login.recover')}</a>
      </div>
      <div className='login-form__row login-form__row_centered'>
        <div className='LoginForm__label-support'>{t('auth.login.support')} <a href='mailto:help@molodost.bz'>help@molodost.bz</a></div>
      </div>
    </form>
  </div>
)

export default translate([ 'common' ])(AuthLogin)

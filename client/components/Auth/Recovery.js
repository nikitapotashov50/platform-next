import { translate } from 'react-i18next'

const AuthRecovery = ({ loginSwitch, values, onInput, submit, errors, message, t }) => (
  <div className='login-form'>
    <h3 className='login-form__title'>{t('auth.recovery.title')}</h3>

    { message && <div className='alert alert_success'>{message}</div> }

    <form autoComplete='off' method='post'>

      <div className='login-form__row'>
        <label className='login-form__label'>{t('auth.recovery.fields.email')}</label>
        <input className='login-form__input' value={values.email} onChange={onInput.bind(this, 'email')} type='text' placeholder={t('auth.recovery.placeholders.email')} />
        { errors.email && (<div>{errors.email}</div>)}
      </div>

      <div className='login-form__row login-form__row_double-margin'>
        <button className='login-form__btn' type='submit' onClick={submit}>{t('auth.recovery.submit')}</button>
      </div>

      <div className='login-form__row login-form__row_centered'>
        <a className='login-form__link' onClick={loginSwitch} href='#'>{t('auth.recovery.login')}</a>
      </div>

    </form>
  </div>
)

export default translate([ 'common' ])(AuthRecovery)

import { translate } from 'react-i18next'
import Loader from '../OverlayLoader'

const AuthSignup = ({ fetching = false, success = false, errors, submit, values, onInput, loginSwitch, t }) => (
  <div className='login-form'>
    <h3 className='login-form__title'>{t('auth.registration.title')}</h3>

    <Loader loading={fetching}>
      <form autoComplete='off'>
        <div className='login-form__row'>
          <label className='login-form__label'>{t('auth.registration.fields.email')}</label>
          <input className='login-form__input' value={values.email} onChange={onInput.bind(this, 'email')} placeholder={t('auth.registration.fields.email')} type='text' />
          { errors.email && (<div>{errors.email}</div>)}
        </div>

        <div className='login-form__row'>
          <label className='login-form__label'>{t('auth.registration.fields.first_name')}</label>
          <input className='login-form__input' value={values.firstName} onChange={onInput.bind(this, 'firstName')} placeholder={t('auth.registration.fields.first_name')} type='text' />
          { errors.firstName && (<div>{errors.firstName}</div>)}
        </div>

        <div className='login-form__row'>
          <label className='login-form__label'>{t('auth.registration.fields.last_name')}</label>
          <input className='login-form__input' value={values.lastName} onChange={onInput.bind(this, 'lastName')} placeholder={t('auth.registration.fields.last_name')} type='text' />
          { errors.lastName && (<div>{errors.lastName}</div>)}
        </div>

        { errors.fetching && (
          <div className='login-form__row login-form__row_centered login-form__row_double-margin'>
            {errors.fetching}
          </div>
        ) }

        <div className='login-form__row login-form__row_double-margin'>
          <button className='login-form__btn' type='submit' onClick={submit}>{t('auth.registration.submit')}</button>
        </div>

        <div className='login-form__row login-form__row_centered'>
          <a className='login-form__link' onClick={loginSwitch} href='#'>{t('auth.registration.login')}</a>
        </div>
      </form>
    </Loader>

    <div className='login-form__row login-form__row_double-margin'>{t('auth.registration.terms')}</div>
  </div>
)

export default translate([ 'common' ])(AuthSignup)

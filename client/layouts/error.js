import AuthLayout from '../layouts/auth'

export default ({ children, code, message, ...props }) => (
  <AuthLayout>
    <div className='error-page'>
      <div className='error-page__code'>{code}</div>
      <div className='error-page__message'>{message}</div>

      { children && children }
    </div>    

    <style jsx>{`
      .error-page {}
      .error-page__code {
        font-size: 120px;
        font-weight: bold;
      }
      .error-page__message {
        font-size: 24px;
      }
    `}</style>
  </AuthLayout>
)
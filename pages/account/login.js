import AuthLogin from '../../client/components/Auth/Login'
import AuthLayout from '../../client/layouts/auth'

const AuthLoginPage = () => (
  <div className='auth-container'>
    <AuthLogin values={{ email: '', password: '' }} errors={{}} onInput={() => {}} />
  </div>
)

export default AuthLayout(AuthLoginPage)

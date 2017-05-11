import AuthSignup from '../../client/components/Auth/Signup'
import AuthLayout from '../../client/layouts/auth'

const AuthLoginPage = () => (
  <div className='auth-container'>
    <AuthSignup values={{ email: '', password: '' }} errors={{}} onInput={() => {}} />
  </div>
)

export default AuthLayout(AuthLoginPage)

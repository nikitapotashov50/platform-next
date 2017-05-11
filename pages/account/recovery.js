import AuthRecovery from '../../client/components/Auth/Recovery'
import AuthLayout from '../../client/layouts/auth'

const AuthLoginPage = () => (
  <div className='auth-container'>
    <AuthRecovery values={{ email: '', password: '' }} errors={{}} onInput={() => {}} />
  </div>
)

export default AuthLayout(AuthLoginPage)

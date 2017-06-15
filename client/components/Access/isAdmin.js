import AutHoc from '../../hocs/AuthWrapper'

export default AutHoc({
  authSelector: ({ auth }) => ({
    user: auth.user,
    isLogged: auth.isLogged
  }),
  predicate: ({ isLogged, user }) => isLogged && user.isAdmin
})

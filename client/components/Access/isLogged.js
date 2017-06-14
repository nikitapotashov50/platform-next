import AutHoc from '../../hocs/AuthWrapper'

export default AutHoc({
  authSelector: ({ auth }) => ({
    isLogged: auth.isLogged
  }),
  predicate: ({ isLogged }) => isLogged
})

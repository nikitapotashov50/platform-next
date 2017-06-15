import AutHoc from '../../hocs/AuthWrapper'

export default role => AutHoc({
  authSelector: ({ auth, user }) => ({
    isLogged: auth.isLogged,
    programs: user.programs.items,
    current: user.programs.current
  }),
  predicate: ({ isLogged, programs, current }) => {
    if (!isLogged) return false
    return current && programs[current] && programs[current].role === role
  }
})

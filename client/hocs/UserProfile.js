import ErrorLayout from '../layouts/error'
import { getUser, getInfo } from '../redux/profile'

export default Next => {
  const UserProfileHoc = ({ user, ...props }) => {
    if (!user) {
      return <ErrorLayout code={404} message={'Пользователь не найден'} />
    }

    return <Next {...props} user={user} />
  }

  UserProfileHoc.getInitialProps = async ctx => {
    let { query } = ctx
    let state = ctx.store.getState()

    if (!state.profile.user || (state.profile.user.name !== query.username)) {
      let { payload } = await ctx.store.dispatch(getUser(query.username))
      if (payload.user && payload.user._id) {
        // ctx.store.dispatch(getInfo(payload.user._id))
        return Next.getInitialProps(ctx)
      }
    } else if (state.profile.user) return Next.getInitialProps(ctx)
  }

  return UserProfileHoc
}

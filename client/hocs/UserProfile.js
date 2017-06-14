import ErrorLayout from '../layouts/error'
import { getUser } from '../redux/profile'

export default Next => {
  const UserProfileHoc = ({ user, ...props }) => {
    if (!user) return <ErrorLayout code={404} message={'Пользователь не найден'} />
    return <Next {...props} user={user} />
  }

  UserProfileHoc.getInitialProps = async ctx => {
    let { query } = ctx
    let state = ctx.store.getState()
    let headers = null
    if (ctx.req) headers = ctx.req.headers

    if (!state.profile.user || (state.profile.user.name !== query.username)) {
      await ctx.store.dispatch(getUser(query.username, { headers }))

      let { profile } = ctx.store.getState()
      if (profile.user && profile.user._id) return Next.getInitialProps(ctx)
    } else if (state.profile.user) return Next.getInitialProps(ctx)
  }

  return UserProfileHoc
}

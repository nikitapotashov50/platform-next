import axios from 'axios'
import { server } from '../../config'
import { getUserInfo, userNotFound } from '../redux/profile'
import ErrorLayout from '../layouts/error'

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
      let { data } = await axios.get(`http://${server.host}:${server.port}/api/user/${query.username}`)

      if (data.user) {
        ctx.store.dispatch(getUserInfo(data))
        return Next.getInitialProps(ctx)
      } else ctx.store.dispatch(userNotFound())
    } else if (state.profile.user) {
      return Next.getInitialProps(ctx)
    }
  }

  return UserProfileHoc
}

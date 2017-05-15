import axios from 'axios'
import { server } from '../../config'
import { getUserInfo, userNotFound } from '../redux/profile'

export default Next => {
  const UserProfileHoc = props => (
    <Next {...props} />
  )

  UserProfileHoc.getInitialProps = async ctx => {
    let { query } = ctx
    let state = ctx.store.getState()

    if (!state.profile.user || (state.profile.user.name !== query.username)) {
      let { data } = await axios.get(`http://${server.host}:${server.port}/api/user/${query.username}`)

      if (data.user) ctx.store.dispatch(getUserInfo(data))
      else ctx.store.dispatch(userNotFound())
    }

    return Next.getInitialProps(ctx)
  }

  return UserProfileHoc
}

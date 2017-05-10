import axios from 'axios'
import { getUserInfo, userNotFound } from '../redux/profile'

export default Next => {
  const UserProfileHoc = props => (
    <Next {...props} />
  )

  UserProfileHoc.getInitialProps = async ctx => {
    let { query } = ctx
    let state = ctx.store.getState()

    if (!state.profile.user || (state.profile.user.name !== query.username)) {
      let { data, status } = await new Promise(async (resolve, reject) => {
        let res = await axios.get('http://localhost:3001/api/user/' + query.username)
        setTimeout(() => { resolve(res) }, 1000)
      })

      if (data.user) ctx.store.dispatch(getUserInfo(data.user))
      else ctx.store.dispatch(userNotFound())
    }

    return Next.getInitialProps && Next.getInitialProps(ctx)
  }

  return UserProfileHoc
}

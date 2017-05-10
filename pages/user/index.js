import Page from '../../client/hocs/Page'
import UserProfile from '../../client/hocs/UserProfile'

import UserLayout from '../../client/layouts/user'
import PostPreview from '../../client/components/Post/Short'
import ReplyForm from '../../client/components/ReplyForm'

const UserPage = ({ user, ...props }) => (
  <UserLayout user={user}>
    <div className='user-blog'>

      <ReplyForm />

      <div className='user-blog__content'>

        <PostPreview />

      </div>

    </div>
  </UserLayout>
)

let mapStateToProps = state => ({
  user: state.profile.user
})

export default Page(UserProfile(UserPage), mapStateToProps)

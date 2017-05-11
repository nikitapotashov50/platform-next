import Img from 'react-image'
import { connect } from 'react-redux'

const UserImage = ({ small, onClick, user }) => {
  let classes = [ 'user-inline__image' ]
  if (small) classes.push('user-inline__image_small')

  if (!onClick) onClick = () => {}

  return (
    <Img
      src={[
        user.picture,
        '/static/img/user.png'
      ]}
      alt={`${user.firstName} ${user.lastName}`}
      style={{
        width: '40px',
        borderRadius: '50%'
      }}
      onClick={onClick} />
  )
}

export default connect(state => ({
  user: state.user
}))(UserImage)

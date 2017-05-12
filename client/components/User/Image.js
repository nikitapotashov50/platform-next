import Img from 'react-image'

const UserImage = ({ small, onClick, user }) => {
  let containerClasses = [ 'user-inline' ]
  let classes = [ 'user-inline__image' ]
  if (small) {
    containerClasses.push('user-inline_small')
    classes.push('user-inline__image_small')
  }

  if (!onClick) onClick = () => {}

  return (
    <div className={containerClasses.join(' ')}>
      <Img
        src={[ user.picture, '/static/img/user.png' ]}
        className={classes.join(' ')}
        alt={`${user.firstName} ${user.lastName}`}
        onClick={onClick}
      />
    </div>
  )
}

export default UserImage

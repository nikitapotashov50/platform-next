import Img from 'react-image'

const UserImage = ({ small, smallest, onClick, user }) => {
  let containerClasses = [ 'user-inline' ]
  let classes = [ 'user-inline__image' ]

  if (small) {
    containerClasses.push('user-inline_small')
    classes.push('user-inline__image_small')
  } else if (smallest) {
    containerClasses.push('user-inline_smallest')
    classes.push('user-inline__image_smallest')
  }

  if (!onClick) onClick = () => {}

  return (
    <div className={containerClasses.join(' ')}>
      <Img src={[ user.picture_small, '/static/img/user.png' ]} className={classes.join(' ')} alt={`${user.first_name} ${user.last_name}`} onClick={onClick} />
    </div>
  )
}

export default UserImage

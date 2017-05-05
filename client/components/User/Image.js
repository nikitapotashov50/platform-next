const UserImage = ({ small, onClick }) => {
  let classes = [ 'user-inline__image' ]
  if (small) classes.push('user-inline__image_small')

  if (!onClick) onClick = () => {}

  return (
    <div className={classes.join(' ')} onClick={onClick} src='' alt='' />
  )
}

export default UserImage

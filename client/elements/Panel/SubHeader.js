export default ({ noPadding, children }) => {
  let classes = [ 'panel__sub-header' ]
  if (noPadding) classes.push('panel__sub-header_no_padding')

  return (
    <div className={classes.join(' ')}>
      {children}
    </div>
  )
}

export default ({ noBorder, children }) => {
  let classes = [ 'panel__menu' ]
  if (noBorder) classes.push('panel__menu_no_border')

  return (
    <div className={classes.join(' ')}>
      {children}
    </div>
  )
}

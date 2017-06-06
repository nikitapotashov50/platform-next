export default ({ children, noBorder, npBottomPadding }) => {
  let classes = [ 'panel__header' ]

  if (noBorder) classes.push('panel__header_no-border')
  if (npBottomPadding) classes.push('panel__header_no-bottom-padding')

  return (
    <div className={classes.join(' ')}>
      {children}
    </div>
  )
}

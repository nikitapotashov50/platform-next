export default ({ children, noBorder }) => {
  let classes = [ 'panel__header' ]

  if (noBorder) classes.push('panel__header_no-border')

  return (
    <div className={classes.join(' ')}>
      {children}
    </div>
  )
}

export default ({ children, noPadding, noVerticalPadding, noHorizontalPadding, paddingClass }) => {
  let classes = [ 'panel__body' ]
  if (noPadding) classes.push('panel__body_no_padding')
  if (noVerticalPadding) classes.push('panel__body_no_vertical-padding')
  if (noHorizontalPadding) classes.push('panel__body_no_horizontal-padding')
  if (paddingClass) classes.push('panel__body_padding panel__body_padding_' + paddingClass)

  return (
    <div className={classes.join(' ')}>
      {children}
    </div>
  )
}

export default ({ maxRate = 10, noValues, onChange, inline = false, rate, ...props }) => {
  let classes = [ 'rating-bar' ]
  if (inline) classes.push('rating-bar_inline')

  const onStarClick = (index, e) => {
    if (onChange) onChange(index)
  }

  let stars = []
  for (var i = 1; i < maxRate; i++) {
    stars.push(
      <span className='rating-star' key={'star-' + i} onClick={onStarClick.bind(this, i)}>
        { (i <= rate) ? <span>&#9733;</span> : <span>&#9734;</span> }
      </span>
    )
  }

  return (
    <div className={classes.join(' ')}>
      {stars}
      { !noValues && <span className='rating-bar'>&nbsp;&nbsp;{rate}</span> }
    </div>
  )
}

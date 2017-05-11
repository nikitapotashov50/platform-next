export default ({ maxRate = 10, inline = false, rate, ...props }) => {
  let classes = [ 'rating-bar' ]
  if (inline) classes.push('rating-bar_inline')

  let stars = []
  for (var i = 0; i < rate; i++) {
    stars.push(<span className='rating-star' key={'star-' + i}>&#9733;</span>)
  }
  for (var i = 0; i < maxRate - rate; i++) {
    stars.push(<span className='rating-star' key={'star-' + rate+i}>&#9734;</span>)
  }  

  return (
    <div className={classes.join(' ')}>
      {stars}
      <span className='rating-bar'>&nbsp;&nbsp;{rate}</span>
    </div>
  )
}

let defaultVisible = 7

const Pager = ({ total, limit, current, onNavigate, visible = defaultVisible }) => {
  let pages = Math.round(total / limit)

  let middleIndex = Math.round(visible / 2)
  let firstVisible = current - (middleIndex - 1)

  if (current < middleIndex) firstVisible = 1
  if (current > (pages - middleIndex)) firstVisible = pages - visible

  let links = []
  for (var i = firstVisible; i < (firstVisible + visible); i++) {
    links.push(
      <button className={[ 'pager__btn', current === i ? 'pager__btn_active' : null ].join(' ')} onClick={onNavigate.bind(this, i)} key={'pager-' + i}>{i}</button>
    )
  }

  return (
    <div className='pager'>
      <button className='pager__btn pager__btn_control' onClick={onNavigate.bind(this, 1)}>«</button>
      {links}
      <button className='pager__btn pager__btn_control' onClick={onNavigate.bind(this, pages - 1)}>»</button>
    </div>
  )
}

Pager.shouldComponentUpdate = () => {
  console.log('12312')
  return false
}

export default Pager

let defaultVisible = 7

const Pager = ({ total, limit, current, onNavigate, visible = defaultVisible, panel = false }) => {
  let prefix = panel ? 'panel-pager' : 'pager'

  current = parseInt(current)
  let pages = Math.ceil(total / limit)

  let middleIndex = Math.round(visible / 2)
  let firstVisible = current - (middleIndex - 1)

  if (current < middleIndex) firstVisible = 1
  if (current > (pages - middleIndex)) firstVisible = pages - visible

  let dispayedCount = firstVisible + visible

  if (pages < visible) {
    firstVisible = 1
    dispayedCount = pages + 1
  }

  let links = []
  for (var i = firstVisible; i < dispayedCount; i++) {
    links.push(
      <button className={[ prefix + '__btn', current === i ? prefix + '__btn_active' : null ].join(' ')} onClick={onNavigate.bind(this, i)} key={'pager-' + i}>{i}</button>
    )
  }

  return (
    <div className={prefix}>
      <button className={prefix + '__btn pager__btn_control'} onClick={onNavigate.bind(this, 1)}>«</button>
      {links}
      <button className={prefix + '__btn pager__btn_control'} onClick={onNavigate.bind(this, pages)}>»</button>
    </div>
  )
}

export default Pager

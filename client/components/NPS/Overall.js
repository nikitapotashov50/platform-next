const NpsOverall = ({ data, t, chart = [] }) => {
  let items = []
  for (var i in data) {
    items.push(
      <div className='nps-overall__item' key={'nps-overall' + i}>
        <div className='nps-overall__value'>{data[i].toFixed(2)}</div>
        <span className='nps-overall__title'>{t(i)}</span>
      </div>
    )
  }

  return (
    <div className='nps-overall'>
      {items}
    </div>
  )
}

export default NpsOverall

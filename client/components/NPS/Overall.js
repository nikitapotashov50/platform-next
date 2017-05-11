export default ({ data, labels = {} }) => {
  let items = []
  for(var i in data) {
    items.push(
      <div className='nps-overall__item' key={'nps-overall' + i}>
        <div className='nps-overall__value'>{data[i]}</div>
        <span className='nps-overall__title'>{labels[i] || 'noname'}</span>
      </div>
    )
  }

  return (
    <div className='nps-overall'>
      {items}
    </div>
  )
}

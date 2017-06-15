const change = (field, next, e) => {
  next(field, e.target.value)
}

export default ({ data = {}, selected = {}, onChange }) => {
  let { programs = [], classes = {} } = data

  return (
    <div className=''>
      { (programs.length > 0) && (
        <div className=''>
          Программа

          <select value={selected.program || ''} onChange={change.bind(this, 'program', onChange)}>
            { programs.map(el => <option value={el._id} key={el._id}>{el.title}</option>)}
          </select>
        </div>
      )}

      <br />

      { (selected.program && classes[selected.program] && classes[selected.program].length > 0) && (
        <div className=''>
          Занятие

          <select value={selected.class || ''} onChange={change.bind(this, 'class', onChange)}>
            { classes[selected.program].map(el => <option value={el._id} key={el._id}>{el.title}</option>)}
          </select>
        </div>
      )}
    </div>
  )
}

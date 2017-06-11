export default ({ data = {} }) => {
  let { programs = [], classes = [] } = data

  return (
    <div className=''>
      { (programs.length > 0) && (
        <div className=''>
          Программа

          <select>
            { programs.map(el => <option value={el._id} key={el._id}>{el.title}</option>)}
          </select>
        </div>
      )}

      { (classes.length > 0) && (
        <div className=''>
          Занятие

          <select>
            { classes.map(el => <option value={el._id} key={el._id}>{el.title}</option>)}
          </select>
        </div>
      )}
    </div>
  )
}

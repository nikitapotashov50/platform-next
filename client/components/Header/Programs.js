import moment from 'moment'

let today = moment()

const Program = ({ el, active, type = null, onChange }) => (
  <div
    onClick={onChange}
    className={[ `programs-menu__item programs-menu__item-${el.code}`, active ? 'programs-menu__item-active' : '', type ? `programs-menu__item-${type}` : '' ].join(' ')}
  >
    {el.number}
  </div>
)

const ProgramSelect = ({ items, current, onChange }) => {
  let arr = Object.values(items).map(el => {
    if (!el) return null
    let data = el.alias.split('-')
    return { _id: el._id, code: data[0], number: data[1] || null, title: el.title, start: el.start, finish: el.finish }
  })

  let active = arr.filter(el => (moment(el.start) < today) && (moment(el.finish) > today))
  let old = arr.filter(el => moment(el.finish) < today)

  return (
    <div className={[ 'programs-menu__wrap' ].join(' ')}>
      { (active && active.length > 0) && active.map(el => {
        if (el) return <Program el={el} key={`active-${el._id}`} active={el._id === current} onChange={onChange.bind(this, el._id)} />
      })}

      { (old && old.length > 0) && (
        <div>
          <div className='programs-menu__old'>
            <span>Прошедшие курсы</span>
          </div>

          { old.map(el => {
            if (el) return <Program el={el} key={`active-${el._id}`} active={el._id === current} type='old' onChange={onChange.bind(this, el._id)} />
          })}
        </div>
      )}
    </div>
  )
}

export default ProgramSelect

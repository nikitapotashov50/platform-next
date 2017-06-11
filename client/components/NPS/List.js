import NpsEntry from './Entry'

export default ({ data, labels }) => (
  <div>
    { data && data.map(el => (
      <NpsEntry data={el} labels={labels} key={'nps-entry-' + el._id} />
    )) }
  </div>
)

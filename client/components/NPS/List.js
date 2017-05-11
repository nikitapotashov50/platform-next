import NpsEntry from './Entry'

export default ({ data, labels }) => (
  <div>
    { data && data.map(el => (
      <NpsEntry {...el} labels={labels} key={'nps-entry-' + el.id} />
    )) }
  </div>
)

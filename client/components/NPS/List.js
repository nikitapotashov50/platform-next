import NpsEntry from './Entry'

export default ({ data }) => (
  <div>
    { data && data.map(el => (
      <NpsEntry {...el} />
    )) }
  </div>
)

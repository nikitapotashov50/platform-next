import NpsEntry from './Entry'

export default ({ data, t }) => (
  <div>
    { data && data.map(el => (
      <NpsEntry data={el} t={t} key={'nps-entry-' + el._id} />
    )) }
  </div>
)

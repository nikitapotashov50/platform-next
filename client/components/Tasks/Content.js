import Panel from '../Panel'
import PanelTitle from '../Panel/Title'
import TextWithImages from '../Post/TextWithImages'

export default ({ task }) => (
  <Panel Header={<PanelTitle title={task.title} />}>
    <TextWithImages text={task.content} />
  </Panel>
)

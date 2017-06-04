import Panel from '../../elements/Panel'
import PanelTitle from '../../elements/Panel/Title'
import TextWithImages from '../Post/TextWithImages'

export default ({ task }) => (
  <Panel Header={<PanelTitle title={task.title} />}>
    <TextWithImages text={task.content} />
  </Panel>
)

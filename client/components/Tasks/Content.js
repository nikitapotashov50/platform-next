import moment from 'moment'

import Panel from '../../elements/Panel'
import PanelTitle from '../../elements/Panel/Title'
import TextWithImages from '../Post/TextWithImages'
import TaskContent from './replyContent/index'

const bodies = {
  KnifePlan: TaskContent.knife
}

export default ({ task }) => {
  let Body = <TextWithImages text={task.content} />

  if (task.type && task.type.model && task.type.item) {
    if (bodies[task.type.model]) {
      let TypeDesc = bodies[task.type.model]
      Body = <TypeDesc data={task.type.item} />
    }
  }

  return (
    <Panel Header={<PanelTitle title={task.title} />}>
      {Body}
      <br />
      <span className='task-remaining' data-prefix='осталось'>Осталось {moment().to(moment(task.finish_at), true)}</span>
    </Panel>
  )
}

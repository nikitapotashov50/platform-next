import { isEmpty } from 'lodash'
import Panel from '../../elements/Panel'
import PanelTitle from '../../elements/Panel/Title'

import Content from './replyContent/index'

export default ({ reply, type, specific = null }) => {
  let ContentBlock = Content[type] || null

  return (
    <Panel Header={<PanelTitle small title='Ваш ответ' />}>
      { (type !== 'default' && !isEmpty(specific)) && (
        <div>
          <ContentBlock data={specific} />
        </div>
      )}

      { reply.content && reply.content}
    </Panel>
  )
}

import { isEmpty } from 'lodash'
import Panel from '../../elements/Panel'
import PanelTitle from '../../elements/Panel/Title'
import PostBody from '../Post/Preview/Body'
import Content from './replyContent/index'

export default ({ reply, type, post = null, specific = null }) => {
  let ContentBlock = Content[type] || null

  return (
    <Panel Header={<PanelTitle small title='Ваш ответ' />}>
      { (type !== 'default' && !isEmpty(specific)) && (
        <div>
          <ContentBlock data={specific} />
        </div>
      )}

      { post && <PostBody post={post} />}
    </Panel>
  )
}

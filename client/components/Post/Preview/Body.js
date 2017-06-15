import Attachments from '../Attachments'
import TextWithImages from '../TextWithImages'
import TaskContent from '../../Tasks/replyContent/index'

export default ({ post = {}, reply = null, onExpand }) => {
  if (!onExpand) onExpand = () => {}

  let TaskReply = null
  if (reply && reply.type) TaskReply = TaskContent[reply.type]

  return (
    <div className='post-preview'>
      <a className='post-preview__title' onClick={onExpand}>{post.title}</a>

      { (reply && TaskReply) && (<TaskReply data={reply.data} />)}
      { (reply && post.content) && (<br />) }
      <TextWithImages text={post.content} />

      { (post.attachments && post.attachments.length > 0) && <Attachments items={post.attachments} />}
    </div>
  )
}

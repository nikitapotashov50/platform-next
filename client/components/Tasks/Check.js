import UserInline from '../User/Inline'
import Panel from '../../elements/Panel'
import TaskSubHeader from '../Post/TaskSubHeader'
import TextWithImages from '../Post/TextWithImages'
import VerifyButtons from './VerifyButtons'
import OverlayLoader from '../OverlayLoader'

import TaskContent from '../Tasks/replyContent/index'

export default ({ post, user, task, specific, created, onVerify, fetching, replyType }) => {
  let Content = TaskContent[replyType]
  console.log(post)
  console.log(specific)
  return (
    <OverlayLoader loading={fetching}>
      <Panel
        Header={<UserInline user={user} date={created} />}
        SubHeader={<TaskSubHeader title={task.title} />}
        Footer={<VerifyButtons onVerify={onVerify} />}
      >
        <div className='post-preview'>
          <a className='post-preview__title'>{post.title}</a>
          <Content data={specific.item} />

          <TextWithImages text={post.content} />

          {/* { (post.attachments && post.attachments.length > 0) && <Attachments items={post.attachments} />} */}
        </div>
      </Panel>
    </OverlayLoader>
  )
}
// Footer={Footer}
//     SubHeader={SubHeader}
//     headerStyles={headerStyles}
//     Options={() => Options}
//     withAnimation={added}
//     showOptions={this.state.showPostMenu}
//     Header={<UserInline user={user} date={this.props.created} />}
//     toggleOptions={this.handleOptionButtonClick.bind(true)}

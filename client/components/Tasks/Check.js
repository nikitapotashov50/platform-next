import UserInline from '../User/Inline'
import Panel from '../../elements/Panel'
import TaskSubHeader from '../Post/TaskSubHeader'
import TextWithImages from '../Post/TextWithImages'
import VerifyButtons from './VerifyButtons'

export default ({ post, user, specific, created, onVerify }) => (
  <Panel
    Header={<UserInline user={user} date={created} />}
    SubHeader={<TaskSubHeader title={post.title} />}
    Footer={<VerifyButtons onVerify={onVerify} />}
  >
    <div className='post-preview'>
      <a className='post-preview__title'>{post.title}</a>
      <TextWithImages text={post.content} />
      {/* { (post.attachments && post.attachments.length > 0) && <Attachments items={post.attachments} />} */}
    </div>
  </Panel>
)
// Footer={Footer}
//     SubHeader={SubHeader}
//     headerStyles={headerStyles}
//     Options={() => Options}
//     withAnimation={added}
//     showOptions={this.state.showPostMenu}
//     Header={<UserInline user={user} date={this.props.created} />}
//     toggleOptions={this.handleOptionButtonClick.bind(true)}

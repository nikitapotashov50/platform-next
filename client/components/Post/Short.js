import Panel from '../Panel'
import UserInline from '../User/Inline'

export default props => {
  return (
    <Panel Header={() => <UserInline />}>
      <div className='post-preview'>
        <a className='post-preview__title' href='#'>{'Заголовок'}</a>
        <div>
          <a className='post-preview__body' href='#'>{'Текст текст текст текст текст текст текст текст текст текст текст'}</a>
        </div>
      </div>
    </Panel>
  )
}

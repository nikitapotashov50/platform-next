import TaskStatus from '../../../elements/Task/Status'

export default ({ title, status }) => (
  <div className='task-sub-header'>
    <div className='task-sub-header__title'>Ответ на задание</div>
    <span className='task-sub-header__link'>{title}</span>
    <div className='task-sub-header__status'>
      <TaskStatus status={status} />
    </div>
  </div>
)

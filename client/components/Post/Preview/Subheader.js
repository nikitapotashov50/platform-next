export default ({ title, status }) => (
  <div className='task-sub-header'>
    <div className='task-sub-header__title'>Ответ на задание</div>
    <span className='task-sub-header__link'>{title}</span>
    <span className={[ 'task-sub-header__status', 'task-sub-header__status_' + status ].join(' ')}>{status}</span>
  </div>
)

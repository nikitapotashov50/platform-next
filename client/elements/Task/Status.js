const translate = {
  rejected: 'Отклонен',
  pending: 'На проверке',
  approved: 'Выполнено'
}

export default ({ status }) => (
  <span className={[ 'task-status', status ? `task-status_${status}` : `` ].join(` `)}>{translate[status]}</span>
)

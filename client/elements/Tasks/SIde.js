import Panel from '../Panel'
import Link from 'next/link'

export default ({ items = [] }) => {
  if (!items.length) return null
  return (
    <Panel Header={<div className='user-side-panel__title'>Задания</div>}>
      { items.map(task => (
        <div key={task._id}>
          <Link href={`/tasks/task?id=${task._id}`} path={`/tasks/${task._id}`}>
            <a>{task.title}</a>
          </Link>
        </div>
      ))}
    </Panel>
  )
}

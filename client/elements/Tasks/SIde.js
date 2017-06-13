import Link from 'next/link'
import Panel from '../Panel'

export default ({ items = [] }) => {
  if (!items.length) return null
  return (
    <Panel>
      <div className='user-side-panel'>
        <div className='user-side-panel__title'>Домашние задания на неделю</div>

        <div className='user-side-panel__body user-side-panel__body_padded'>
          { items.map(task => (
            <div key={task._id} className='user-side-panel__dz'>
              <Link href={`/tasks/task?id=${task._id}`} path={`/tasks/${task._id}`}>
                <a>{task.title}</a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  )
}

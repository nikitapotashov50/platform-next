import TaskPreview from '../Preview'
import Panel from '../../../elements/Panel'
      // <div className='tasks-inline-header'>Выполнено</div>

      // { (tasks.replied.length > 0) && tasks.replied.map(el => (
      //   <TaskPreview key={el._id} link={getLink(el._id)} task={el} completed status='pending' statusText='На проверке' />
      // ))}z

const CurrentList = ({ tasks, getLink }) => (
  <div>
    { (tasks.knife.length > 0) && tasks.knife.map(el => (
      <TaskPreview key={el._id} link={getLink(el._id)} task={el} />
    ))}

    { (tasks.knife.length > 0) && (<div className='tasks-inline-header'>Активные задания</div>) }

    { (tasks.active.length > 0) && tasks.active.map(el => (
      <TaskPreview key={el._id} link={getLink(el._id)} task={el} />
    ))}

    { (!tasks.active.length) && (
      <Panel>
        <div className='text-center'>У вас нет активных заданий, отдыхайте.</div>
      </Panel>
    )}

    <style jsx>{`
      .tasks-inline-header {
        margin: 20px 0;

        font-size: 11px;
        font-weight: 600;
        text-align: center;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: color(#ebebeb b(+50%));
      }
    `}</style>
  </div>
)

export default CurrentList

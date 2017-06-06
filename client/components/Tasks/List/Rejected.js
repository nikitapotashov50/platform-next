import TaskPreview from '../Preview'

export default ({ tasks, getLink }) => (
  <div>
    { (tasks.active.length > 0) && tasks.active.map(el => (
      <TaskPreview key={el._id} link={getLink(el._id)} task={el} />
    ))}
  </div>
)

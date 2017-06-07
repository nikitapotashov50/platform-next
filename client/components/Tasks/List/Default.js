import TaskPreview from '../Preview'

export default type => ({ tasks, getLink }) => (
  <div>
    { (tasks.active.length > 0) && tasks.active.map(el => (
      <TaskPreview key={el._id} completed status={type} link={getLink(el._id)} task={el} />
    ))}
  </div>
)

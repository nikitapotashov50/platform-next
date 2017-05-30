import moment from 'moment'
import Panel from '../Panel'
import Link from 'next/link'

export default ({ task, link }) => (
  <Panel bodyStyles={{ paddingClass: 'smallest' }}>
    <div className='task-preview'>
      <div className='task-preview__block task-preview__block_title'>
        <div className='task-preview__title'>{task.title}</div>
        <div className='task-preview__description'>{task.content}</div>
      </div>
      <div className='task-preview__block task-preview__block_status'>
        осталось
        <br />
        {moment().to(moment(task.finish_at), true)}
      </div>
      <div className='task-preview__block task-preview__block_status'>
        <Link href={link.href} as={link.path}>
          <button className='task-preview__button'>Выполнить</button>
        </Link>
      </div>
    </div>

    <style jsx>{`
        .task-preview {
          display: flex;
        }
        .task-preview__block {
          vertical-align: top;
          display: inline-block;
        }
        .task-preview__block_title {
          width: 60%;
        }
        .task-preview__block_status {
          width: 20%;
          text-align: center;
          border-left: 1px solid #ebebeb;
        }

        .task-preview__title {
          line-height: 26px;

          font-size: 22px;
          font-weight: bold;
        }
        .task-preview__description {
          font-size: 14px;
          font-weight: 400;
        }

        .task-preview__button {
          color: #196aff;
        }
      `}</style>
  </Panel>
)

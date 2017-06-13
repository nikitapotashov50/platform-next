import moment from 'moment'
import numeral from 'numeral'
import Panel from '../../elements/Panel'
import Link from 'next/link'
import TaskStatus from '../../elements/Task/Status'

const KnifeDescription = ({ data }) => (
  <div>
    <div>Действие: {data.action}</div>
    <div>Цель: {numeral(data.goal || 0).format('0,0')} ₽</div>
    <div>{ data.price && (`Цена слова: ${data.price}`)}</div>
  </div>
)

const descriptions = {
  KnifePlan: KnifeDescription
}

const getTaskTypeCode = task => {
  if (task.type) return task.type.model.toLowerCase()
  switch (task.replyTypeId) {
    case 2: return 'set-knife'
    case 3: return 'set-goal'
    case 1:
    default: return 'default'
  }
}

export default ({ task, link, completed = false, status = null }) => {
  let Description = null
  if (task.type && task.type.model && task.type.item) {
    if (descriptions[task.type.model]) {
      let TypeDesc = descriptions[task.type.model]
      Description = <TypeDesc data={task.type.item} />
    }
  } else Description = <div className='task-preview__description'>{task.content}</div>

  return (
    <Panel bodyStyles={{ paddingClass: 'smallest' }}>
      <div className={'task-preview'}>
        <div className='task-preview__block task-preview__block_title'>
          <div className={[ 'task-preview__icon', `task-preview__icon-${getTaskTypeCode(task)}` ].join(' ')} />
          <div className='task-preview__title'>{task.title}</div>
          {Description}
        </div>

        <div className='task-preview__block task-preview__block_status'>
          { !completed && (<span className='task-remaining' data-prefix='осталось'>{moment().to(moment(task.finish_at), true)}</span>) }
          { completed && (<TaskStatus status={status} />)}
        </div>

        <div className='task-preview__block task-preview__block_status'>
          <Link href={link.href} as={link.path}>
            <a className='task-preview__button'>{ completed ? 'Просмотр' : 'Выполнить' }</a>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .task-remaining {
          font-size: 18px;
          font-weight: 700;
        }
        .task-remaining:before {
          display: block;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 500;
          content: attr(data-prefix);
        }

        .task-preview__icon {
          width: 50px;
          height: 50px;
          float: left;
          border-radius: 25px;
          background-color: #f0e034;
          margin-right: 15px;
        }

        .task-preview__icon-knifeplan {
          background-image: url('/static/img/tasks/kinjal.png');
          background-size: 26px 25px;
          background-position: center center;
          background-repeat: no-repeat;
        }
        .task-preview__icon-default {
          background-color: #444;
        }

        .task-preview {
          display: flex;
        }
        .task-preview__block {
          vertical-align: top;
          display: inline-block;
        }
        .task-preview__block_title {
          width: 64%;
        }
        .task-preview__block_status {
          width: 18%;
          display: flex;
          align-items: center;
          justify-content: center;

          text-align: center;
          border-left: 1px solid #ebebeb;
        }

        .task-preview__title {
          line-height: 27px;

          font-size: 18px;
          font-weight: bold;
        }
        .task-preview__description {
          overflow-y: hidden;
          line-height: 16px;
          max-height: 32px;

          font-size: 14px;
          font-weight: 300;
          color: #666;
        }

        .task-preview__button {
          color: #196aff;
        }

        /*  Мобильные стили */
        @media screen and (max-width: 39.9375em) {

          .task-preview {
            display: block;
            overflow: hidden;
          }

          .task-preview__block {
          vertical-align: top;
          display: inline;
          }
          .task-preview__block_title {
            float: left;
            
          width: 100%;
          }

          .task-preview__block_status {
            width: 50%;
            border-left: 0 none;
            float: left;
            overflow: hidden;
            padding: 20px 0 15px 0;
            line-height: 0;
            
          }

          .task-remaining:before {
          display: inline;
          float: left;
          font-size: 12px;
          font-weight: 500;
      
          text-transform: uppercase;
          letter-spacing: 1px;
          content: attr(data-prefix);
        }
        .task-remaining {
          font-size: 12px;
          font-weight: 700;
          padding-left: 50px;
        }
      }
      `}</style>
    </Panel>
  )
}

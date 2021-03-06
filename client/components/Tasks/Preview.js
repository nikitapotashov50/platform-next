import moment from 'moment'
import Panel from '../../elements/Panel'
import Link from 'next/link'

export default ({ task, link, completed = false, status = null, statusText = null }) => (
  <Panel bodyStyles={{ paddingClass: 'smallest' }}>
    <div className={'task-preview'}>
      <div className='task-preview__block task-preview__block_title'>
        <div className='task-preview__title'>{task.title}</div>
        <div className='task-preview__description'>{task.content}</div>
      </div>

      <div className='task-preview__block task-preview__block_status'>
        { !completed && (<span className='task-remaining' data-prefix='осталось'>{moment().to(moment(task.finish_at), true)}</span>) }
        { completed && (
          <span className={[ 'task-status', status ? ('task-status_' + status) : '' ].join(' ')}>{statusText}</span>
        )}
      </div>

      <div className='task-preview__block task-preview__block_status'>
        <Link href={link.href} as={link.path}>
          <a className='task-preview__button'>{ completed ? 'Просмотр' : 'Выполнить' }</a>
        </Link>
      </div>
    </div>

    <style jsx>{`
      .task-remaining {
        font-size: 22px;
      }
      .task-remaining:before {
        display: block;
        font-size: 12px;
        content: attr(data-prefix);
      }

      .task-status {}
      .task-status_pending {}
      .task-status_rejected {}
      .task-status_approved {}

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
        display: flex;
        align-items: center;
        justify-content: center;

        text-align: center;
        border-left: 1px solid #ebebeb;
      }

      .task-preview__title {
        line-height: 36px;

        font-size: 22px;
        font-weight: bold;
      }
      .task-preview__description {
        overflow-y: hidden;
        height: 42px;

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

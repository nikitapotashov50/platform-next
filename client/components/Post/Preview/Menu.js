import onClickOutside from 'react-onclickoutside'
import moment from 'moment'
import Link from 'next/link'

let today = moment()
const checkTime = (created, target) => Math.abs(moment(created).diff(target, 'minutes')) < 60 * 24

const PostMenu = ({ onEdit, onDelete, post, reply = {} }) => (
  <div className='dropdown'>
    <ul>
      { checkTime(post.created, today) && (<li onClick={onEdit}>Редактировать</li>) }
      { (reply._id && (moment(reply.created) <= moment(reply.finish_at))) && (
        <li>
          <Link href={`/tasks/task?id=${reply._id}`} path={`/tasks/${reply._id}`}>
            <a>Редактировать ответ</a>
          </Link>
        </li>
      )}
      <li onClick={onDelete}>Удалить</li>
    </ul>

    <style jsx>{`
      .dropdown {
        right: 10px;
        border-radius: 3px;
        top: 20px;
        position: absolute;
        background: #fff;
        border: 1px solid #e1e3e4;
        z-index: 2;
      }

      li {
        padding: 10px;
        font-size: 14px;
      }

      li a { color: #1f1f1f; }
      li:hover a { color: #fefefe; }

      li:hover {
        background: #196aff;
        color: #fefefe;
        cursor: pointer;
      }
    `}</style>
  </div>
)

export default onClickOutside(PostMenu, {
  handleClickOutside: ({ props }) => props.onClose
})

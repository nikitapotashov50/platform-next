import onClickOutside from 'react-onclickoutside'

const PostMenu = ({ onDelete }) => (
  <div className='dropdown'>
    <ul>
      <li>Редактировать</li>
      <li onClick={onDelete}>Удалить</li>
    </ul>

    <style jsx>{`
      .dropdown {
        right: 0;
        border-radius: 3px;
        top: 20px;
        position: absolute;
        background: #fff;
        border: 1px solid #e1e3e4;
      }

      li {
        padding: 10px;
        font-size: 14px;
      }

      li:hover {
        background: #196aff;
        color: #fefefe;
        cursor: pointer;
      }
    `}</style>
  </div>
)

export default onClickOutside(PostMenu, {
  handleClickOutside: ({ props }) => props.handleClickOutside
})

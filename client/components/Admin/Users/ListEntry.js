// import Link from 'next/link'
import UserInline from '../../User/Inline'

export default ({ user, onClick }) => (
  <div className='user-admin-entry'>
    <div className='user-admin-entry__block user-admin-entry__block_body'>
      <UserInline user={user} />
    </div>
    <div className='user-admin-entry__block user-admin-entry__block_buttons'>
      <div>
        <a className='' onClick={onClick}>Инфо</a>
      </div>
    </div>

    <style jsx>{`
      .user-admin-entry {}
      .user-admin-entry__block {
        box-sizing: border-box;

        vertical-align: top;
        display: inline-block;
      }
      .user-admin-entry__block_body {
        width: 75%;
        padding-right: 10px;
      }
      .user-admin-entry__block_buttons {
        width: 25%;
        text-align: right;
      }
    `}</style>
  </div>
)

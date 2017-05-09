import Link from 'next/link'
import Img from 'react-image'
import onClickOutside from 'react-onclickoutside'
import Button from '../../elements/Button'

const CommentForm = ({ user }) => (
  <div className='comment'>
    <div className='user-photo-container'>
      <Link href={`/@${user.name}`}>
        <Img
          src={[
            user.picture,
            '/static/img/user.png'
          ]}
          alt={`${user.firstName} ${user.lastName}`}
          style={{
            width: '30px',
            borderRadius: '50%',
            marginRight: '10px'
          }} />
      </Link>
    </div>
    <input
      autoFocus
      className='leave-comment'
      type='text'
      placeholder='оставить комментарий' />
    <Button>Отправить</Button>

    <style jsx>{`
      .comment {
        border-top: 1px solid #efeff0;
        margin-top: 15px;
        padding-top: 15px;
        display: flex;
        font-size: 14px;
      }

      input.leave-comment {
        border: none;
      }
    `}</style>
  </div>
)

export default onClickOutside(CommentForm, {
  handleClickOutside: ({ props }) => props.handleClickOutside
})

import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import Img from 'react-image'
import HeartIcon from 'react-icons/lib/fa/heart'
import CommentIcon from 'react-icons/lib/fa/comment'
import EllipsisIcon from 'react-icons/lib/fa/ellipsis-h'
import classNames from 'classnames'
import TextWithImages from './TextWithImages'
import CommentForm from '../Comment/Form'
import { deletePost } from '../../redux/actions'

class Post extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showCommentForm: false,
      showPostMenu: false
    }
    this.handleCommentButtonClick = this.handleCommentButtonClick.bind(this)
    this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this)
  }

  handleCommentButtonClick () {
    this.setState({
      showCommentForm: true
    })
  }

  handleDeleteButtonClick () {
    this.props.deletePost(this.props.id)
  }

  render () {
    const { title, content, user, currentUser, added } = this.props

    return (
      <div className={classNames('post', { 'with-animation': added })}>

        <div className='header'>
          <div className='user-info'>
            <div className='user-photo-container'>
              <Link href={`/@${user.name}`}>
                <Img
                  src={[
                    user.picture_small,
                    '/static/img/user.png'
                  ]}
                  alt={`${user.first_name} ${user.last_name}`}
                  style={{
                    width: '50px',
                    borderRadius: '50%',
                    marginRight: '10px'
                  }} />
              </Link>
            </div>

            <div>
              <Link href={`/@${user.name}`}>
                <a className='user-name'>{user.first_name} {user.last_name}</a>
              </Link>
              <div className='user-occupation'>Монтаж охранно-пожарных систем, видеонаблюдения, контроля доступом, локальные сети, автоматизация, продажа оборудования, проектирование и техническое обслуживание систем безопасности.</div>
            </div>
          </div>

          <div className='post-menu'>
            <EllipsisIcon color='#DADEE1' onClick={() => {
              this.setState({
                showPostMenu: !this.state.showPostMenu
              })
            }} />
          </div>
          {this.state.showPostMenu && (
            <div className='dropdown'>
              <ul>
                <li>Редактировать</li>
                <li onClick={this.handleDeleteButtonClick}>Удалить</li>
              </ul>
            </div>
          )}
        </div>

        <h1 className='post-title'>{title}</h1>

        <TextWithImages text={content} />

        <div className='footer'>
          <div className='like-button' style={{ marginRight: '15px' }}>
            <HeartIcon color='#DADEE1' /> Нравится 0
          </div>
          <div className='comment-button' onClick={this.handleCommentButtonClick}>
            <CommentIcon color='#DADEE1' /> Комментировать
          </div>
        </div>

        {this.state.showCommentForm && (
          <CommentForm
            user={currentUser}
            handleClickOutside={() => {
              this.setState({
                showCommentForm: false
              })
            }} />
        )}

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

          .header {
            display: flex;
            justify-content: space-between;
            position: relative;
          }

          .post-menu {
            cursor: pointer;
          }

          .post {
            padding: 15px;
            margin: 0 0 15px;
            background: #fff;
            border: 1px solid #e1e3e4;
            border-radius: 3px;
          }

          .with-animation {
            animation-duration: 0.5s;
            animation-name: fadeIn;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }

            to {
              opacity: 100%;
            }
          }

          .user-info {
            display: flex;
            align-items: flex-start;
            max-width: 390px;
            margin-bottom: 15px;
          }

          .user-name {
            color: #1f1f1f;
            font-weight: 700;
            font-size: 14px;
          }

          .user-occupation {
            font-size: 12px;
            color: #7d7d7d;
            margin-top: 4px;
          }

          .user-photo-container {
            cursor: pointer;
          }

          .post-title {
            font-family: museo_sans_cyrl,Helvetica,Arial,sans-serif;
            font-weight: 700;
            font-size: 14px;
            margin: 0 0 5px;
          }

          .footer {
            border-top: 1px solid #efeff0;
            margin-top: 15px;
            padding-top: 15px;
            display: flex;
            font-size: 14px;
            color: #9da5ab;
            font-weight: normal;
          }

          .like-button {
            margin-right: 15px;
          }

          .like-button, .comment-button {
            padding: 5px;
            border-radius: 3px;
            cursor: pointer;
          }

          .like-button:hover, .comment-button:hover {
            background: #f5f7fa;
          }

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
  }
}

const mapStateToProps = state => ({
  currentUser: state.user
})

const mapDispatchToProps = dispatch => ({
  deletePost: id => dispatch(deletePost(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(Post)

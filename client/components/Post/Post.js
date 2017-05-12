import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import Img from 'react-image'
import HeartIcon from 'react-icons/lib/fa/heart'
import CommentIcon from 'react-icons/lib/fa/comment'
import EllipsisIcon from 'react-icons/lib/fa/ellipsis-h'
import classNames from 'classnames'
import Menu from './Menu'
import TextWithImages from './TextWithImages'
import CommentForm from '../Comment/Form'
import CommentList from '../Comment/CommentList'
import { deletePost } from '../../redux/posts'
import { isEmpty } from 'lodash'
import TimeAgo from '../TimeAgo'

class Post extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showCommentForm: !isEmpty(this.props.comments) || false,
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
    const { id, title, content, user, created_at, currentUser, added, comments = [] } = this.props

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
              <div className='name-and-date'>
                <Link href={`/@${user.name}`}>
                  <a className='user-name'>{user.first_name} {user.last_name}</a>
                </Link>
                <div className='post-date'>
                  {/* eslint-disable camelcase */}
                  <TimeAgo date={created_at} />
                  {/* eslint-enable camelcase */}
                </div>
              </div>
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
            <Menu
              onDelete={this.handleDeleteButtonClick}
              handleClickOutside={() => {
                this.setState({
                  showPostMenu: false
                })
              }} />
          )}
        </div>

        <h1 className='post-title'>{title}</h1>

        <TextWithImages text={content} />

        <div className='post-buttons'>
          <div className='like-button' style={{ marginRight: '15px' }}>
            <HeartIcon color='#DADEE1' /> Нравится 0
          </div>
          <div className='comment-button' onClick={this.handleCommentButtonClick}>
            <CommentIcon color='#DADEE1' /> Комментировать
          </div>
        </div>

        <div className='post-comments'>
          <CommentList comments={comments} />
        </div>

        {this.state.showCommentForm && (
          <CommentForm
            postId={id}
            user={currentUser}
            handleClickOutside={() => {
              this.setState({
                showCommentForm: false
              })
            }} />
        )}

        <style jsx>{`
          .header {
            display: flex;
            justify-content: space-between;
            position: relative;
          }

          .post-menu {
            align-self: flex-start;
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

          .post-buttons {
            border-top: 1px solid #efeff0;
            margin-top: 15px;
            padding-top: 15px;
            display: flex;
            font-size: 14px;
            color: #9da5ab;
            font-weight: normal;
          }

          .post-comments {
            border-top: 1px solid #efeff0;
            margin-top: 15px;
            padding-top: 15px;
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

          .post-date {
            font-size: 12px;
            color: #7d7d7d;
            margin-left: 10px;
          }

          input.leave-comment {
            border: none;
          }

          .name-and-date {
            display: flex;
            align-items: baseline;
          }
        `}</style>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.auth.user
})

const mapDispatchToProps = dispatch => ({
  deletePost: id => dispatch(deletePost(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(Post)

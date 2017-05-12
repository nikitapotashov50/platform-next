import { connect } from 'react-redux'
import React, { Component } from 'react'
import Menu from './Menu'
import Panel from '../Panel'
import UserInline from '../User/Inline'
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
    this.handleOptionButtonClick = this.handleOptionButtonClick.bind(this)
  }

  handleCommentButtonClick () {
    this.setState({
      showCommentForm: true
    })
  }

  handleDeleteButtonClick () {
    this.props.deletePost(this.props.id)
  }

  handleOptionButtonClick () {
    this.setState({
      showPostMenu: !this.state.showPostMenu
    })
  }

  render () {
    const { showPostMenu } = this.state
    const { id, title, content, user, currentUser, added, created_at, comments = [] } = this.props

    const Footer = (
      <div className='post-summary'>
        <div className='post-summary__block_left'>
          <a className='post-summary__info post-summary__info_icon post-summary__info_icon_like' data-prefix='Нравится:  ' href='#'>0</a>
          <a className='post-summary__info post-summary__info_icon post-summary__info_icon_comment' onClick={this.handleCommentButtonClick}>Комментировать</a>
        </div>
        <div className='post-summary__block_right'>
          <div className='post-summary__info' />
        </div>
        <CommentList comments={comments} />
        <CommentForm
          postId={id}
          user={currentUser}
          handleClickOutside={() => {
            this.setState({ showCommentForm: false })
          }}
        />
      </div>
    )

    const Options = showPostMenu ? (
      <Menu
        onDelete={this.handleDeleteButtonClick}
        handleClickOutside={() => {
          this.setState({ showPostMenu: false })
        }}
      />
    ) : null

    return (
      <Panel
        Footer={() => Footer}
        Header={(
          <div>
            <UserInline user={user} />
            {/* eslint-disable camelcase */}
            <TimeAgo date={created_at} />
            {/* eslint-enable camelcase */}
          </div>
        )}
        Options={() => Options}
        withAnimation={added}
        toggleOptions={() => {
          this.setState({ showPostMenu: true })
        }}
      >
        <div className='post-preview'>
          <a className='post-preview__title' href='#'>{title}</a>
          <TextWithImages text={content} />
        </div>

        {/* {this.state.showCommentForm && (
          <CommentForm
            postId={id}
            user={currentUser}
            handleClickOutside={() => {
              this.setState({ showCommentForm: false })
            }}
          />
        )} */}

      </Panel>
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

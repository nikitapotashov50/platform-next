import { connect } from 'react-redux'
import React, { Component } from 'react'

import Menu from './Menu'
import Panel from '../Panel'
import UserInline from '../User/Inline'
import TextWithImages from './TextWithImages'
import CommentForm from '../Comment/Form'

import { deletePost } from '../../redux/posts'

class Post extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showCommentForm: false,
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
    this.setState({ showPostMenu: !this.state.showPostMenu })
  }

  render () {
    const { showPostMenu } = this.state
    const { title, content, user, currentUser } = this.props

    let Footer = (
      <div className='post-summary'>
        <div className='post-summary__block_left'>
          <a className='post-summary__info post-summary__info_icon post-summary__info_icon_like' data-prefix='Нравится:  ' href='#'>0</a>
          <a className='post-summary__info post-summary__info_icon post-summary__info_icon_comment' onClick={this.handleCommentButtonClick}>Комментировать</a>
        </div>
        <div className='post-summary__block_right'>
          <div className='post-summary__info' />
        </div>
      </div>
    )

    let Options = null
    if (showPostMenu) {
      Options = (
        <Menu
          onDelete={this.handleDeleteButtonClick}
          handleClickOutside={async () => {
            await this.setState({ showPostMenu: false })
          }}
        />
      )
    }

    return (
      <Panel
        Footer={() => Footer}
        Header={<UserInline user={user} />}
        Options={() => Options}
        toggleOptions={async () => {
          await this.setState({ showPostMenu: true })
        }}
      >
        <div className='post-preview'>
          <a className='post-preview__title' href='#'>{title}</a>

          <TextWithImages text={content} />
        </div>

        { this.state.showCommentForm && (
          <CommentForm
            user={currentUser}
            handleClickOutside={() => {
              this.setState({ showCommentForm: false })
            }}
          />
        )}
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

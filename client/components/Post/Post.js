import React, { Component } from 'react'

import Menu from './Menu'
import Panel from '../Panel'
import PostSummary from './Summary'
import Comments from '../Comment/List'
import UserInline from '../User/Inline'
import TextWithImages from './TextWithImages'

import Attachments from './Attachments'

class Post extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showPostMenu: false,
      showCommentForm: false,
      likes: props.likes_count - Number(props.isLiked || false)
    }

    this.handleEditButtonClick = this.handleEditButtonClick.bind(this)
    this.handleOptionButtonClick = this.handleOptionButtonClick.bind(this)
    this.handleCommentButtonClick = this.handleCommentButtonClick.bind(this)
  }

  handleCommentButtonClick () {
    this.setState({ showCommentForm: true })
  }

  handleEditButtonClick () {
    console.log('edit post')
  }

  handleOptionButtonClick () {
    this.setState({ showPostMenu: !this.state.showPostMenu })
  }

  getFooter () {
    let { id, loggedUser, comments = [], onLike, isLiked } = this.props
    let { showCommentForm, likes } = this.state

    const Footer = (
      <div>
        <PostSummary
          liked={isLiked}
          onLike={onLike}
          isLogged={!!loggedUser}
          likes={likes + Number(isLiked)}
          onComment={this.handleCommentButtonClick}
        />

        <Comments ids={comments} postId={id} expanded={showCommentForm} />
      </div>
    )

    return Footer
  }

  render () {
    const { showPostMenu } = this.state
    const { title, content, attachments, user, added, onExpand, onRemove } = this.props

    let Footer = this.getFooter()

    const myPost = this.props.loggedUser && this.props.loggedUser === user.id

    const Options = myPost && showPostMenu ? (
      <Menu
        onDelete={onRemove}
        onEdit={this.handleEditButtonClick}
        handleClickOutside={() => {
          this.setState({ showPostMenu: false })
        }}
      />
    ) : null

    return (
      <div>
        <Panel
          Footer={Footer}
          Header={<UserInline user={user} date={this.props.created_at} />}
          headerStyles={{ noBorder: true, npBottomPadding: true }}
          Options={() => Options}
          withAnimation={added}
          showOptions={this.state.showPostMenu}
          toggleOptions={() => {
            this.setState({ showPostMenu: true })
          }}
        >
          <div className='post-preview'>
            <a className='post-preview__title' onClick={onExpand}>{title}</a>
            <TextWithImages text={content} />
            { (attachments && attachments.length > 0) && <Attachments items={attachments} />}
          </div>
        </Panel>
      </div>
    )
  }
}

export default Post

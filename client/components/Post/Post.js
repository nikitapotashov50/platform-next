import React, { Component } from 'react'

import Menu from './Menu'
import Panel from '../Panel'
import PostSummary from './Summary'
import Comments from '../Comment/List'
import UserInline from '../User/Inline'
import TextWithImages from './TextWithImages'
import Attachments from './Attachments'
import EditPost from './EditPost'

class Post extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showPostMenu: false,
      showCommentForm: false,
      likes: props.likes_count - Number(props.isLiked || false),
      editPost: false
    }

    this.handleEditButtonClick = this.handleEditButtonClick.bind(this)
    this.handleOptionButtonClick = this.handleOptionButtonClick.bind(this)
    this.handleCommentButtonClick = this.handleCommentButtonClick.bind(this)
  }

  handleCommentButtonClick () {
    this.setState({ showCommentForm: true })
  }

  handleEditButtonClick () {
    this.setState({ editPost: true })
  }

  handleOptionButtonClick () {
    this.setState({ showPostMenu: !this.state.showPostMenu })
  }

  getFooter () {
    let { _id, loggedUser, comments = [], onLike, isLiked } = this.props
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

        <Comments ids={comments} postId={_id} expanded={showCommentForm} />
      </div>
    )

    return Footer
  }

  render () {
    const { showPostMenu } = this.state
    const { title, content, attachments, user, added, onExpand, onRemove } = this.props

    let Footer = this.getFooter()

    const myPost = false
    // const myPost = this.props.loggedUser && this.props.loggedUser === user._id

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
          Header={<UserInline user={user} date={this.props.created} />}
          headerStyles={{ noBorder: true, npBottomPadding: true }}
          Options={() => Options}
          withAnimation={added}
          showPostMenu={this.state.showPostMenu}
          showPostMenuButton={myPost}
          toggleOptions={() => {
            this.setState({ showPostMenu: true })
          }}
        >
          <div className='post-preview'>
            {this.state.editPost ? (
              <EditPost
                title={title}
                content={content}
                id={this.props.id}
                exitEdit={() => {
                  this.setState({
                    editPost: false
                  })
                }} />
            ) : (
              <div>
                <a className='post-preview__title' onClick={onExpand}>{title}</a>
                <TextWithImages text={content} />
              </div>
            )}
            { (attachments && attachments.length > 0) && <Attachments items={attachments} />}
          </div>
        </Panel>
      </div>
    )
  }
}

export default Post

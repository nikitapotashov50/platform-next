import React, { Component } from 'react'

import PostMenu from './Preview/Menu'
import PostFooter from './Preview/Footer'

import TaskHeader from './Preview/Subheader'
import Panel from '../../elements/Panel'
import UserInline from '../User/Inline'
import TextWithImages from './TextWithImages'
import TaskContent from '../Tasks/replyContent/index'
import Attachments from './Attachments'
import EditPost from './EditPost'
import PostBody from './Preview/Body'

class Post extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showPostMenu: false,
      showCommentForm: false,
      editPost: false,
      likes: props.post.likes_count - Number(props.post.isLiked || false)
    }

    this.toggleOptions = this.toggleOptions.bind(this)
    this.handleEditButtonClick = this.handleEditButtonClick.bind(this)
  }

  handleEditButtonClick () {
    this.setState({ editPost: true })
  }

  toggleOptions (flag) {
    this.setState({ showPostMenu: flag })
  }

  render () {
    const { likes, showPostMenu } = this.state
    const { post, user, added, onExpand, reply, onLike, isLiked, loggedUser, onRemove, onComment } = this.props

    let Footer = <PostFooter onLike={onLike} isLiked={isLiked} likes={likes} loggedUser={loggedUser} onComment={onComment} />

    let myPost = loggedUser === user._id

    const Options = <PostMenu onClose={this.toggleOptions.bind(this, false)} onDelete={onRemove} onEdit={this.handleEditButtonClick} />

    let headerStyles = { noBorder: true }

    let SubHeader = null
    if (reply) SubHeader = <TaskHeader {...reply} />
    else headerStyles.npBottomPadding = true

    return (
      <Panel
        noMargin
        withAnimation={added}
        //
        Footer={Footer}
        SubHeader={SubHeader}
        Header={<UserInline user={user} date={post.created} />}
        //
        headerStyles={headerStyles}
        //
        Options={() => Options}
        showOptions={myPost && showPostMenu}
        toggleOptions={this.toggleOptions.bind(this, !showPostMenu)}
      >
        <PostBody post={post} reply={reply} onExpand={onExpand} />
      </Panel>
    )
  }
}

export default Post

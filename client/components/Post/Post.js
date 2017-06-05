import React, { Component } from 'react'

// import PostMenu from './Preview/Menu'
// import PostFooter from './Preview/Footer'
// import Menu from './Menu'
import Panel from '../../elements/Panel'
import UserInline from '../User/Inline'
import TextWithImages from './TextWithImages'

import TaskContent from '../Tasks/replyContent/index'

import Attachments from './Attachments'

class Post extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showPostMenu: false,
      showCommentForm: false,
      likes: props.post.likes_count - Number(props.post.isLiked || false)
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

  handleOptionButtonClick (flag) {
    this.setState({ showPostMenu: flag })
  }

  /** TODO: разобраться что за хрень */
  getFooter () {
    // let { post, loggedUser, onLike, isLiked } = this.props
    // let { showCommentForm, likes } = this.state
    // let footerProps = { _id: post._id, loggedUser, comments: post.comments, onLike, isLiked, showCommentForm, likes }

    // const Footer = <PostFooter {...footerProps} onComment={this.handleCommentButtonClick} />

    return null
  }

  render () {
    // const { showPostMenu } = this.state
    const { post, user, added, onExpand, reply } = this.props
    // onRemove

    let Footer = this.getFooter()

    // const myPost = this.props.loggedUser && this.props.loggedUser === user._id
    const Options = null
    // const Options = <PostMenu opened={myPost && showPostMenu} onDelete={onRemove} onEdit={this.handleEditButtonClick} onClose={this.handleOptionButtonClick} />

    let headerStyles = { noBorder: true }
    let SubHeader = null
    if (reply) {
      SubHeader = (
        <div className='task-sub-header'>
          <div className='task-sub-header__title'>Ответ на задание</div>
          <span className='task-sub-header__link'>Задание</span>
        </div>
      )
    } else headerStyles.npBottomPadding = true

    let TaskReply = null
    if (reply && reply.type) TaskReply = TaskContent[reply.type]

    return (
      <Panel
        Footer={Footer}
        SubHeader={SubHeader}
        headerStyles={headerStyles}
        Options={() => Options}
        withAnimation={added}
        showOptions={this.state.showPostMenu}
        Header={<UserInline user={user} date={this.props.created} />}
        toggleOptions={this.handleOptionButtonClick.bind(true)}
      >
        <div className='post-preview'>
          <a className='post-preview__title' onClick={onExpand}>{post.title}</a>
          { (reply && TaskReply) && (<TaskReply data={reply.data} />)}
          <TextWithImages text={post.content} />
          { (post.attachments && post.attachments.length > 0) && <Attachments items={post.attachments} />}
        </div>
      </Panel>
    )
  }
}

export default Post

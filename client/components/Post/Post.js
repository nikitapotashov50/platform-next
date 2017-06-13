import { isEqual, pick } from 'lodash'
import React, { Component } from 'react'

import PostMenu from './Preview/Menu'
import PostFooter from './Preview/Footer'

import TaskHeader from './Preview/Subheader'
import Panel from '../../elements/Panel'
import UserInline from '../User/Inline'
import PostBody from './Preview/Body'
import PostEdit from './Preview/Edit'

class Post extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showPostMenu: false,
      showCommentForm: false,
      editPost: false,
      likes: props.post.likes_count - Number(props.isLiked || false)
    }

    this.toggleOptions = this.toggleOptions.bind(this)
    this.handleEditButtonClick = this.handleEditButtonClick.bind(this)
  }

  handleEditButtonClick (flag) {
    this.setState({ editPost: flag })
  }

  shouldComponentUpdate (nextProps, nextState) {
    let flag = !isEqual(nextProps.post, this.props.post) || !isEqual(nextProps.reply, this.props.reply) || !isEqual(nextProps.user, this.props.user) || nextProps.isLiked !== this.props.isLiked || nextProps.loggedUser !== this.props.loggedUser
    return flag || !isEqual(nextState, this.state)
  }

  toggleOptions (flag) {
    this.setState({ showPostMenu: flag })
  }

  render () {
    let { likes, showPostMenu, editPost } = this.state
    const { post, user, added, onExpand, reply, onLike, isLiked, loggedUser, onRemove, onComment } = this.props

    let Footer = <PostFooter onLike={onLike} isLiked={isLiked} likes={likes} loggedUser={loggedUser} onComment={onComment} />

    let myPost = user ? loggedUser === user._id : false

    const Options = <PostMenu post={post} reply={pick(reply, [ 'created', 'finish_at', '_id' ])} onClose={this.toggleOptions.bind(this, false)} onDelete={onRemove} onEdit={this.handleEditButtonClick.bind(this, true)} />

    let headerStyles = { noBorder: true }

    let SubHeader = null
    if (reply) SubHeader = <TaskHeader {...reply} />
    else headerStyles.npBottomPadding = true

    return (
      <Panel
        noMargin
        withAnimation={added}
        Footer={Footer}
        SubHeader={SubHeader}
        Header={<UserInline user={user} date={post.created} />}
        //
        headerStyles={headerStyles}
        //
        Options={() => Options}
        showOptions={myPost && showPostMenu}
        toggleOptions={this.toggleOptions.bind(this, true)}
      >
        { !editPost && (<PostBody edit={editPost} post={post} reply={reply} onExpand={onExpand} />) }
        { editPost && (<PostEdit data={post} onCancel={this.handleEditButtonClick.bind(this, false)} />)}
      </Panel>
    )
  }
}

export default Post

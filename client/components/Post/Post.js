import React, { Component } from 'react'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'

import Menu from './Menu'
import Panel from '../Panel'
import PostSummary from './Summary'
import UserInline from '../User/Inline'
import TextWithImages from './TextWithImages'
import CommentForm from '../Comment/Form'
import CommentList from '../Comment/CommentList'
import { deletePost, addLike } from '../../redux/posts'

class Post extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showPostMenu: false,
      showCommentForm: !isEmpty(this.props.comments) || false
    }

    this.handleCommentButtonClick = this.handleCommentButtonClick.bind(this)
    this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this)
    this.handleOptionButtonClick = this.handleOptionButtonClick.bind(this)
    this.handleLikeButtonClick = this.handleLikeButtonClick.bind(this)
  }

  handleCommentButtonClick () {
    this.setState({
      showCommentForm: true
    })
  }

  handleDeleteButtonClick () {
    console.log('click delete')
    // this.props.deletePost(this.props.id)
  }

  handleLikeButtonClick () {
    this.props.addLike(this.props.id)
  }

  handleOptionButtonClick () {
    this.setState({
      showPostMenu: !this.state.showPostMenu
    })
  }

  getFooter () {
    let { showCommentForm } = this.state
    let { likes = [], comments = [], id, currentUser, isLogged } = this.props

    const Footer = []

    Footer.push(
      <PostSummary
        isLogged={isLogged}
        likes={likes}
        onComment={this.handleCommentButtonClick}
        onLike={this.handleLikeButtonClick} />
      )

    if (comments.length) {
      Footer.push(<CommentList comments={comments} />)
    }

    if (isLogged && (comments.length || showCommentForm)) {
      Footer.push(
        <CommentForm
          postId={id}
          user={currentUser}
          expanded={showCommentForm}
          handleClickOutside={() => {
            this.setState({ showCommentForm: false })
          }}
        />
      )
    }

    return Footer
  }

  render () {
    const { showPostMenu } = this.state
    const { title, content, user, added, onExpand } = this.props

    let Footer = this.getFooter()

    const Options = showPostMenu ? (
      <Menu
        onDelete={this.handleDeleteButtonClick}
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
          toggleOptions={() => {
            this.setState({ showPostMenu: true })
          }}
        >
          <div className='post-preview'>
            <a className='post-preview__title' onClick={onExpand}>{title}</a>
            <TextWithImages text={content} />
          </div>
        </Panel>
      </div>
    )
  }
}

const mapStateToProps = ({ auth }) => ({
  currentUser: auth.user,
  isLogged: auth.isLogged
})

const mapDispatchToProps = dispatch => ({
  deletePost: id => dispatch(deletePost(id)),
  addLike: id => dispatch(addLike(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(Post)

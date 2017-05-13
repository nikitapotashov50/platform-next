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
// import TimeAgo from '../TimeAgo'
import PostSummary from './Summary'

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

  getFooter () {
    let { showCommentForm } = this.state
    let { comments = [], id, currentUser } = this.props

    const Footer = []

    Footer.push(<PostSummary likes={0} onComment={this.handleCommentButtonClick} />)

    if (comments.length) {
      Footer.push(<CommentList comments={comments} />)
    }

    if (comments.length || showCommentForm) {
      Footer.push(
        <CommentForm
          postId={id}
          user={currentUser}
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
    const { title, content, user, added } = this.props

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
          <a className='post-preview__title' href='#'>{title}</a>
          <TextWithImages text={content} />
        </div>
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

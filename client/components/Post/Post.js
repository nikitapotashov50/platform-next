import React, { Component } from 'react'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'
import Slider from 'react-slick'

import Menu from './Menu'
import Panel from '../Panel'
import PostSummary from './Summary'
import UserInline from '../User/Inline'
import TextWithImages from './TextWithImages'
import CommentForm from '../Comment/Form'
import CommentList from '../Comment/CommentList'
import { deletePost, addLike, removeLike } from '../../redux/posts'

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
    this.handleEditButtonClick = this.handleEditButtonClick.bind(this)
  }

  handleCommentButtonClick () {
    this.setState({
      showCommentForm: true
    })
  }

  handleDeleteButtonClick () {
    this.props.deletePost(this.props.id)
  }

  handleEditButtonClick () {
    console.log('edit post')
  }

  handleLikeButtonClick () {
    if (this.props.liked) {
      this.props.removeLike(this.props.id)
    } else {
      this.props.addLike(this.props.id)
    }
  }

  handleOptionButtonClick () {
    this.setState({
      showPostMenu: !this.state.showPostMenu
    })
  }

  getFooter () {
    let { showCommentForm } = this.state
    let { id, currentUser, isLogged, comments } = this.props

    const Footer = []

    Footer.push(
      <PostSummary
        isLogged={isLogged}
        // liked={liked}
        likes={this.props.likes_count}
        comments={this.props.comments_count}
        onComment={this.handleCommentButtonClick}
        onLike={this.handleLikeButtonClick} />
      )

    if (comments.length) {
      Footer.push(<CommentList comments={comments} />)
    }

    if (isLogged && (this.props.comments_count || showCommentForm)) {
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
    const { title, content, attachments, user, added, onExpand } = this.props

    let Footer = this.getFooter()

    const Options = showPostMenu ? (
      <Menu
        onEdit={this.handleEditButtonClick}
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
        showOptions={this.state.showPostMenu}
        toggleOptions={() => {
          this.setState({ showPostMenu: true })
        }}
      >
        <div className='post-preview'>
          <a className='post-preview__title' onClick={onExpand}>{title}</a>
          <TextWithImages text={content} />
          {/* <div>{attachments && attachments.map(({ id, path }) => (
            <img key={id} src={path} style={{ maxWidth: '100%', marginBottom: '15px' }} />
          ))}</div> */}

          { (attachments && attachments.length > 0) && (
            <div style={{ height: '500px' }}>
              {/*
                // centerMode
                // adaptiveHeight={false}>
              */}
              <Slider slidesToShow={1} dots infinite={false}>
                {(attachments || []).map(x => (
                  <div key={x.id} style={{ width: '500px', background: '#ccc' }}>
                    <img src={x.path} style={{height: '500px'}} />
                  </div>
                ))}
              </Slider>
            </div>
          )}

          {/* <div style={{ overflow: 'hidden' }}>{attachments && <Gallery images={attachments.map(x => ({
            src: x.path,
            thumbnail: x.path,
            thumbnailWidth: null,
            thumbnailHeight: null
          }))} enableImageSelection={false} />}</div> */}
        </div>
      </Panel>
    )
  }
}

const mapStateToProps = ({ auth }) => ({
  currentUser: auth.user,
  isLogged: auth.isLogged
})

const mapDispatchToProps = dispatch => ({
  deletePost: id => dispatch(deletePost(id)),
  addLike: id => dispatch(addLike(id)),
  removeLike: id => dispatch(removeLike(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(Post)

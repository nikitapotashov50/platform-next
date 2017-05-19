import React, { Component } from 'react'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'
import Lightbox from 'react-images'

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
      images: this.props.attachments.map(x => ({ src: x.path })),
      showPostMenu: false,
      showCommentForm: !isEmpty(this.props.comments) || false,
      isLightboxOpen: false
    }

    this.handleCommentButtonClick = this.handleCommentButtonClick.bind(this)
    this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this)
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

  getFooter () {
    let { showCommentForm } = this.state
    let { likes = [], comments = [], id, currentUser, isLogged, liked } = this.props

    const Footer = []

    Footer.push(
      <PostSummary
        isLogged={isLogged}
        likes={likes}
        liked={liked}
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
    const { showPostMenu, isLightboxOpen } = this.state
    const { title, content, attachments, user, added, onExpand } = this.props

    let Footer = this.getFooter()

    const myPost = this.props.currentUser.id === user.id

    const Options = myPost && showPostMenu ? (
      <Menu
        onEdit={this.handleEditButtonClick}
        onDelete={this.handleDeleteButtonClick}
        handleClickOutside={() => {
          this.setState({ showPostMenu: false })
        }}
      />
    ) : null

    let goal = null
    if (user.Goals && user.Goals.length) goal = user.Goals[0]

    return (
      <div>
        <Panel
          Footer={Footer}
          Header={<UserInline user={user} goal={goal} date={this.props.created_at} />}
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

            {attachments && (
              <div className='attachments-container'>
                {attachments.map((attachment, index) => (
                  <div key={attachment.id} onClick={() => {
                    this.setState({
                      isLightboxOpen: true,
                      lightboxShowIndex: index
                    })
                  }}><img src={attachment.path} /></div>
                ))}
              </div>
            )}

            {isLightboxOpen && <Lightbox
              images={this.state.images}
              // backdropClosesModal
              currentImage={this.state.lightboxShowIndex}
              onClickPrev={() => {
                this.setState({
                  lightboxShowIndex: this.state.lightboxShowIndex - 1
                })
              }}
              onClickNext={() => {
                this.setState({
                  lightboxShowIndex: this.state.lightboxShowIndex + 1
                })
              }}
              isOpen={isLightboxOpen}
              onClose={() => {
                this.setState({
                  isLightboxOpen: false
                })
              }} />}

            {/* {isOpen && <Lightbox onCloseRequest={() => this.setState({ isOpen: false })} mainSrc={'https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/jeremiah-wilson-1.jpg'} />} */}

            {/* <div>{attachments && attachments.map(({ id, path }) => (
              <img key={id} src={path} style={{ maxWidth: '100%', marginBottom: '15px' }} />
            ))}</div> */}

            {/* {attachments.length > 0
              ? <div style={{ height: '500px' }}>
                <Slider
                  slidesToShow={1}
                  dots
                  infinite={false}
                  // centerMode
                  // adaptiveHeight={false}
                >{(attachments || []).map(x => {
                  return (
                    <div key={x.id} style={{ width: '500px', background: '#ccc' }}>
                      <img src={x.path} style={{height: '500px'}} />
                    </div>
                  )
                })}</Slider>
              </div>
              : null
            } */}

            {/* <div style={{ overflow: 'hidden' }}>{attachments && <Gallery images={attachments.map(x => ({
              src: x.path,
              thumbnail: x.path,
              thumbnailWidth: null,
              thumbnailHeight: null
            }))} enableImageSelection={false} />}</div> */}
          </div>
        </Panel>

        <style jsx>{`
          .attachments-container {
            /*padding: .5vw;*/
            font-size: 0;
            display: flex;
            flex-flow: row wrap;
          }

          .attachments-container div {
            flex: auto;
            width: 150px;
            margin: .5vw;
          }

          .attachments-container div img {
            max-width: 100%;
            height: auto;
          }

          @media screen and (max-width: 400px) {
            .attachments-container div {
              width: 100px;
              margin: 2px;
            }
            .attachments-container {
              padding: 0;
            }
          }
        `}</style>
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
  addLike: id => dispatch(addLike(id)),
  removeLike: id => dispatch(removeLike(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(Post)

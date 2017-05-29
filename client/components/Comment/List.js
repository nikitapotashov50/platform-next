import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { uniq } from 'lodash'
import { loadMore, fetchStart, fetchEnd, reduce, remove } from '../../redux/posts/comments'

import Form from './Form'
import Comment from './Comment'

const CommentsList = ({ user, postId, loadMore, remove, comments, ids, users, total, fetching, isAll, expanded }) => {
  let btnText = !fetching ? (isAll ? 'Скрыть комментарии' : 'Показать больше') : 'Загрузка...'
  let classes = [ 'comments' ]
  if (total > 0 || expanded) classes.push('comments_footer')

  return (
    <div className={classes.join(' ')}>
      { (total > 0) && (
        <div className='comments__block comments__block_list'>
          { (total > 3) && (
            <button className='comments__more' onClick={loadMore}>{btnText}</button>
          )}

          { ids.map(el => {
            if (comments[el]) {
              let author = users[comments[el].userId]
              return <Comment key={'comment-' + comments[el]._id} {...comments[el]} currentUser={user._id} user={author} remove={remove(comments[el]._id)} />
            }
          })}
        </div>
      )}

      { (user && (total > 0 || expanded)) && (
        <div className='comments__block comments__block_form'>
          <Form user={user} postId={postId} expanded={expanded} />
        </div>
      )}
    </div>
  )
}

const mapStateToProps = ({ posts, auth, users }) => ({
  currentUser: auth.user,
  comments: posts.comments,
  users
})

const mapDispatchToProps = dispatch => bindActionCreators({
  remove,
  reduce,
  loadMore,
  fetchEnd,
  fetchStart
}, dispatch)

const mergeProps = (state, dispatchProps, props) => {
  let ids = uniq([ ...props.ids, ...(state.comments.added[props.postId] || []) ])
  let comments = (state.comments.items[props.postId] || []).reduce((object, item) => {
    object[item._id] = item
    return object
  }, {})

  let moreComments = async () => {
    dispatchProps.fetchStart(props.postId)
    await dispatchProps.loadMore(props.postId)
    dispatchProps.fetchEnd()
  }

  let lessComments = () => {
    dispatchProps.reduce(props.postId, 3)
  }

  let remove = id => async () => {
    await dispatchProps.remove(id, props.postId)
  }

  let total = ids.length
  let isAll = total <= Object.keys(comments).length

  return {
    ids,
    comments,
    //
    isAll,
    total,
    footer: props.footer,
    postId: props.postId,
    expanded: props.expanded,
    //
    users: state.users,
    user: state.currentUser,
    //
    remove,
    loadMore: isAll ? lessComments : moreComments,
    fetching: state.comments.fetching && (state.comments.fetching === props.postId)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CommentsList)

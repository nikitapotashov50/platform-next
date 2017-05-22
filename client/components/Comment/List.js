import { pick } from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadMore, fetchStart, fetchEnd, reduce, remove } from '../../redux/posts/comments'

import Form from './Form'
import Comment from './Comment'

const CommentsList = ({ user, postId, loadMore, remove, comments, ids, users, total, fetching, isAll, expanded }) => {
  let btnText = !fetching ? (isAll ? 'Скрыть комментарии' : 'Показать больше') : 'Загрузка...'

  return (
    <div className='comments comments_footer'>
      { (total > 0) && (
        <div className='comments__block comments__block_list'>
          { (total > 3) && (
            <button className='comments__more' onClick={loadMore}>{btnText}</button>
          )}

          { ids.map(el => {
            if (comments[el]) return <Comment key={'comment-' + el} {...comments[el]} currentUser={user.id} user={users[comments[el].user_id]} remove={remove(el)} />
          })}
        </div>
      )}

      { (user && (total > 0 || expanded)) && (
        <div className='comments__block comments__block__form'>
          <Form user={user} postId={postId} expanded={expanded} />
        </div>
      )}
    </div>
  )
}

const mapStateToProps = ({ posts, auth }) => ({
  currentUser: auth.user,
  comments: posts.comments,
  users: posts.posts.users
})

const mapDispatchToProps = dispatch => bindActionCreators({
  remove,
  reduce,
  loadMore,
  fetchEnd,
  fetchStart
}, dispatch)

const mergeProps = (state, dispatchProps, props) => {
  let ids = [ ...props.ids.map(el => el.id), ...(state.comments.added[props.postId] ? state.comments.added[props.postId] : []) ]

  let comments = pick(state.comments.items, ids)
  let userIds = []

  for (var i in comments) { userIds.push(comments[i].user_id) }

  let moreComments = async () => {
    dispatchProps.fetchStart(props.postId)

    await dispatchProps.loadMore(ids.slice(0, ids.length - 3))
    dispatchProps.fetchEnd()
  }

  let lessComments = () => {
    dispatchProps.reduce(ids.slice(0, ids.length - 3))
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
    postId: props.postId,
    expanded: props.expanded,
    //
    user: state.currentUser,
    users: pick(state.users, userIds),
    //
    remove,
    loadMore: isAll ? lessComments : moreComments,
    fetching: state.comments.fetching && (state.comments.fetching === props.postId)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CommentsList)

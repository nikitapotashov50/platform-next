import { connect } from 'react-redux'
import { isUndefined } from 'lodash'
import { bindActionCreators } from 'redux'

import RateBar from '../../Rating/Bar'
import Button from '../../../elements/Button'
import OverlayLoader from '../../OverlayLoader'

import { ratePost, changeValue, closeVoting } from '../../../redux/posts/vote'

const PostRate = ({ rating = null, postId, loggedUser, voted = false, data, fetching = false, success = null, submit, change, result = {}, postAuthor = null }) => {
  let isVoted = result.total || voted || (loggedUser === postAuthor)
  let total = voted ? (rating ? rating.total : 0) : (result.total || (data.score || 0))
  let nps = result.total_nps || (rating ? rating.total_nps : 0)

  return (
    <OverlayLoader loading={fetching}>
      <div className='post-rating'>
        <div className={[ 'post-rating__title', isVoted ? 'post-rating__title_voted' : '' ].join(' ')}>{ isVoted ? 'Оценка поста' : 'Оцените пост' }</div>
        <div className='post-rating__body'>
          <div className='post-rating__bar'>
            <RateBar noValues rate={total.toFixed(0)} onChange={change} clickable={!isVoted} big />
          </div>
          <div className='post-rating__value'>
            { (!success && isVoted) && `NPS: ${(result.total_nps || nps).toFixed(2)}`}
            { (!success && !isVoted) && <Button onClick={submit} disabled={isUndefined(data.score) || fetching || success}>Оценить</Button> }
            { success && <div>Спасибо за отзыв!</div> }
          </div>
        </div>

        <style jsx>{`
          .post-rating {}
          .post-rating__title {
            height: 25px;
            line-height: 25px;
          }
          .post-rating__footer {
            padding-top: 5px;
          }
          .post-rating__body {
            display: flex;
            justify-content: space-between;
          }
          .post-rating__bar {
            padding: 3px 0;
          }
          .post-rating__value {
            height: 39px;
            line-height: 39px;

            font-size: 20px;
            font-weight: 700;
            padding-left: 20px;
          }

          @media screen and (max-width: 39.9375em) {
            .post-rating__title {
              text-align: center;
            }
            .post-rating__title_voted {
              display: none;
            }
            .post-rating__body {
              display: block;
              text-align: center;
            }
            .post-rating__bar {}
            .post-rating__value {
              padding: 3px 0 0 0;
              height: auto;
              line-height: 33px;
            }
          }
        `}</style>
      </div>
    </OverlayLoader>
  )
}

const mapStateToProps = ({ posts }) => ({ ...posts.vote })

const mapDispatchToProps = dispatch => bindActionCreators({
  ratePost,
  changeValue,
  closeVoting
}, dispatch)

const mergeProps = (state, dispatch, props) => ({
  ...state,
  ...props,
  success: state.success === props.postId,
  data: state.data[props.postId] || {},
  result: state.result[props.postId] || {},
  change: rate => {
    dispatch.changeValue('score', rate, props.postId)
  },
  submit: () => {
    let { data } = state
    dispatch.ratePost(data[props.postId], props.postId)
    setTimeout(() => {
      dispatch.closeVoting()
    }, 2000)
  }
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(PostRate)

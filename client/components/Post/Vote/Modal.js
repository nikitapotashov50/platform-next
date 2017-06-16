import { isNil } from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Modal from '../../Modal'
import RateBar from '../../Rating/Bar'
import OverlayLoader from '../../OverlayLoader'

import { ratePost, changeValue, closeVoting } from '../../../redux/posts/vote'

const PostVoting = ({ opened = true, postId = null, success = null, data = {}, fetching, close, submit, change }) => (
  <Modal isOpened={opened && postId} width={300}>
    { !isNil(success) && (<div>123</div>)}
    { isNil(success) && (
      <OverlayLoader loading={fetching}>
        <div>Оцените пост</div>
        <RateBar />
      </OverlayLoader>
    )}
  </Modal>
)

const mapStateToProps = ({ posts }) => ({ ...posts.vote })

const mapDispatchToProps = dispatch => bindActionCreators({
  ratePost,
  changeValue,
  closeVoting
}, dispatch)

const mergeProps = (state, dispatch, props) => ({
  ...state,
  ...props,
  change: (field, e) => {
    let value = e.target.value.replace(/(<([^>]+)>)/ig, '')
    dispatch.changeValue(field, value)
  },
  submit: () => {
    dispatch.ratePost(state.data, state.postId)
    setTimeout(() => {
      dispatch.closeVoting()
    }, 2000)
  },
  close: () => {
    if (!state.fetching) dispatch.closeVoting()
  }
})

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(PostVoting)

import { isUndefined } from 'lodash'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import Button from '../../../elements/Button'
import OverlayLoader from '../../OverlayLoader'

import { updatePost } from '../../../redux/posts/index'

class PostEdit extends Component {
  constructor (props) {
    super(props)

    this.state = {
      affected: {},
      fetching: false
    }

    this.submit = this.submit.bind(this)
    this.cancel = this.cancel.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onChange (field, e) {
    let value = e.target.value.replace(/(<([^>]+)>)/ig, '')

    this.setState(state => {
      state.affected[field] = value
    })
  }

  async submit () {
    let { affected } = this.state
    if (!isUndefined(affected.title) && !affected.title) return
    if (!isUndefined(affected.content) && !affected.content) return

    this.setState({ fetching: true })
    await this.props.dispatch(updatePost(this.props.data._id, affected))
    this.setState({ fetching: false })
    this.cancel()
  }

  async cancel () {
    await this.setState({ affected: {} })
    this.props.onCancel()
  }

  render () {
    let { data } = this.props
    let { affected, fetching } = this.state

    return (
      <OverlayLoader loading={fetching}>
        <div>
          <input className='' type='text' placeholder={'Заголовок отчета'} onChange={this.onChange.bind(this, 'title')} value={isUndefined(affected.title) ? data.title : affected.title} />
        </div>
        <br />
        <div>
          <textarea className='' type='text' placeholder={'Текст отчета'} onChange={this.onChange.bind(this, 'content')} style={{ minHeight: '200px' }} value={isUndefined(affected.content) ? data.content : affected.content} />
        </div>
        <br />
        <div>
          <Button onClick={this.submit}>Сохранить</Button>
          <Button onClick={this.cancel}>Отменить</Button>
        </div>
      </OverlayLoader>
    )
  }
}

export default connect()(PostEdit)

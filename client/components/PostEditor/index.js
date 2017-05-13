import axios from 'axios'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import clickOutside from 'react-click-outside'

// import Form from './Form'
import { addPost } from '../../redux/posts'

class PostEditor extends Component {
  constructor (props) {
    super(props)

    this.state = {
      expanded: false,
      title: '',
      content: ''
    }

    this.handleContentChange = this.handleContentChange.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.createPost = this.createPost.bind(this)
    this.expand = this.expand.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
    this.clearForm = this.clearForm.bind(this)
  }

  async createPost (e) {
    e.preventDefault()
    const { title, content } = this.state
    const post = { title, content }

    if (title && content) {
      const { data } = await axios.post('/api/post', post, { withCredentials: true })
      this.props.addPost({ ...data, added: true })
      this.clearForm()
    }
  }

  clearForm () {
    this.setState({
      expanded: false,
      title: '',
      content: ''
    })
  }

  expand () {
    this.setState({
      expanded: true
    })
  }

  handleContentChange (e) {
    this.setState({
      content: e.target.value
    })
  }

  handleTitleChange (e) {
    this.setState({
      title: e.target.value
    })
  }

  handleClickOutside () {
    if (this.state.title || this.state.content) return

    this.setState({
      expanded: false
    })
  }

  render () {
    let { expanded, title, content } = this.state

    let textareaClasses = [ 'reply-form__textarea' ]
    if (!expanded) textareaClasses.push('reply-form__textarea_short')

    return (
      <div className='reply-form'>
        { expanded && (
          <div className='panel panel_margin_small'>
            <input className='reply-form__input reply-form__input_text_big' value={title} onChange={this.handleTitleChange} type='text' placeholder='Заголовок отчета' />
          </div>
        )}

        <div className='panel panel_margin_small'>
          <textarea className={textareaClasses.join(' ')} value={content} onChange={this.handleContentChange} placeholder={'Написать отчет за сегодня'} rows={expanded ? 8 : 1} onFocus={this.expand} />
        </div>

        { expanded && (
          <div className='reply-form__submit-block'>
            <button className='myBtn' onClick={this.createPost} type='submit' tabIndex='4'><span title='Запостить как '>Отправить</span></button>
          </div>
        )}
      </div>
    )

    /*
    return (
      <Form
        title={this.state.title}
        handleTitleChange={this.handleTitleChange}
        content={this.state.content}
        handleContentChange={this.handleContentChange}
        handleClickOutside={this.handleClickOutside}
        createPost={this.createPost}
      />
    )
    */
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  addPost
}, dispatch)

const wrappedComponent = clickOutside(PostEditor)

export default connect(() => ({}), mapDispatchToProps)(wrappedComponent)

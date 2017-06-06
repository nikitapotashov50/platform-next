import React, { Component } from 'react'
import AppleIcon from 'react-icons/lib/fa/apple'
import AndroidIcon from 'react-icons/lib/fa/android'

class ChatLoginForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      password: ''
    }
  }

  render () {
    const { submit, onSuccess, onError } = this.props

    return (
      <div>
        <div>Сообщения!</div>
        <div>
          <a href='https://apple.com'>
            <AppleIcon size={30} />
          </a>
          <a href='https://google.com'>
            <AndroidIcon size={30} />
          </a>
        </div>
        <input
          type='password'
          placeholder='пароль от бм учетки'
          value={this.state.password}
          onChange={e => {
            this.setState({
              password: e.target.value
            })
          }} />

        <button onClick={async () => {
          const action = await submit(this.state.password)
          if (action.error) {
            onError()
          } else {
            onSuccess()
          }
        }}>Начать использовать сообщения</button>

        <style jsx>{`
          button {
            background: blue;
            color: #fff;
            cursor: pointer;
          }
        `}</style>
      </div>
    )
  }
}

export default ChatLoginForm

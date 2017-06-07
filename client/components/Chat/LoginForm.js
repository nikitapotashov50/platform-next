import React, { Component } from 'react'

class ChatLoginForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      password: ''
    }
  }

  render () {
    const { submit } = this.props

    return (
      <div className='messages__login-form'>
        <div className='messages__splash-left'>
          <div>
            <h5 className='messages__splash-subtitle'>Личные сообщения</h5>
            <h3 className='messages__splash-title'>Общайтесь в Учебе через «БМ Радар»
          </h3>

            <p className='messages__splash-par'><b>Введите пароль</b> от этого БМ-аккаунта,
              чтобы создать аккаунт в «Радаре».
              Если для вашей почты аккаунт уже создан, он привяжется автоматически.
          </p>
          </div>

          <input
            type='password'
            placeholder='Введите пароль'
            className='messages__splash-input'
            value={this.state.password}
            onChange={e => {
              this.setState({
                password: e.target.value
              })
            }} />

          <button
            onClick={() => {
              submit(this.state.password)
            }}
            className='messages__splash-btn'
          // onClick={async () => {
          //   const action = await submit(this.state.password)
          //   if (action.error) {
          //     onError()
          //   } else {
          //     onSuccess()
          //   }
          // }}
        />

        </div>

        <div className='messages__splash'>
          <h5 className='messages__splash-download'>Скачивайте приложение</h5>
          <a href='https://itunes.apple.com/ru/app/бм-радар/id1201226982' target='_blank' className='messages__appstore' ><img src='/static/img/bmradar/appstore.png' alt='Скачать из App Store' /></a>
          <a href='https://play.google.com/store/apps/details?id=ru.maximumsoft.bm_radar' target='_blank' className='messages__gplay'><img src='/static/img/bmradar/gplay.png' alt='Скачать из App Store' /></a>
        </div>

        <style jsx>{`
          button {
            background: blue;
            color: #fff;
            cursor: pointer;
          }

          .messages__login-form {
              width: 567px;
              height: 284px;
              background: #fff;
            }
          .messages__splash {
            background-image: url('/static/img/bmradar.png');
            background-size: 274px 279px;
            width: 268px;
            height: 279px;
            float: right;
            margin-top: 5px;
          }

          .messages__splash-left {
            float: left;
            width: 260px;
            padding: 30px 0 0 35px;
          }

          .messages__splash-title {
            font-size: 25px;
            line-height: 30px;
            font-weight: 500;
          }
          .messages__splash-par {
            font-size: 13px;
            line-height: 19px;
            font-weight: 500;
            margin-top: 13px;
            margin-bottom: 17px;
          }
          .messages__splash-subtitle {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 10px;
            font-weight: 500;
          }
          .messages__splash-input {
            border: 1px solid #e1e3e4;
            border-radius: 3px;
            width: 205px;
            height: 35px;
            float: left;
          }
          .messages__splash-input:hover {
            border: 1px solid #cdd1d4;
          }
          .messages__splash-btn {
            border-radius: 3px;
            width: 40px;
            height: 35px;
            float: left;
            background: #196aff;
            margin-left:5px;
            background-image: url('/static/img/messages-send-white.png');
            background-size: 20px 17px;
            background-position: 11px 9px;
            background-repeat: no-repeat;
          }

          .messages__splash-download {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 12px;
            font-weight: 500;
            text-align: center;
            margin-top: 195px;
          }
          .messages__appstore {
            margin-left: 30px;
            margin-right: 10px;
          }
          .messages__appstore img {
            width: 100px;
            height: 28px;
          }
          .messages__gplay img {
            width: 94px;
            height: 28px;
          }
          
        `}</style>
      </div>
    )
  }
}

export default ChatLoginForm

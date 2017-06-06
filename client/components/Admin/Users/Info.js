import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getUserInfo, clearUserInfo } from '../../../redux/admin/users'

import ProgramInfo from './InfoPrograms'
import ProgramInfoEdit from './InfoProgramsEdit'

let Programs = {
  edit: ProgramInfoEdit,
  default: ProgramInfo
}

class AdminUserInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      edit: {
        program: null
      }
    }

    this.toggleEdit = this.toggleEdit.bind(this)
  }

  ProgramComponent (type = 'default') { return Programs(type) }

  componentWillMount () {
    this.props.getUserInfo(this.props.userId)
  }

  componentWillUnmount () {
    this.props.clearUserInfo()
  }

  toggleEdit (type, id) {
    return async () => {
      await this.setState(state => { state.edit[type] = id })
    }
  }

  changeParam (type) {
    return async (e) => {
      console.log(type, e.target.value)
    }
  }

  render () {
    if (!this.props.user) return null
    const user = this.props.user
    const { programs, role, groups } = user
    const { edit } = this.state

    return (
      <div className='user-modal'>
        <div className='user-modal__header'>
          <h1 className='user-modal__title'>{user.first_name + ' ' + user.last_name}</h1>
          <h2 className='user-modal__sub-title'>{role.title}</h2>
        </div>

        { (programs && programs.length) && (
          <div className='user-modal__block'>
            <h2 className='user-modal__block-title'>Программы</h2>
            { programs.map(el => {
              let flag = edit.program === el._id
              let PC = Programs[flag ? 'edit' : 'default']
              return <PC key={el._id} program={el.programId} role={el.roleId} meta={el.meta} onChange={this.changeParam('program')} onEdit={this.toggleEdit('program', el._id)} />
            })}
          </div>
        )}

        { (groups && groups.length) && (
          <div className='user-modal__block'>
            <h2 className='user-modal__block-title'>Группы</h2>
            { groups.map(el => (
              <div key={el}>{el}</div>
            ))}
          </div>
        )}

        <style jsx>{`
          .user-modal {}
          .user-modal__header {
            padding: 0 0 15px;
            margin-bottom: 20px;
            border-bottom: 1px solid #ebebeb;
          }
          .user-modal__title {
            line-height: 20px;
          }
          .user-modal__sub-title {
            color: #999;
            margin-top: -10px;

            font-weight: 300;
          }
          .user-modal__block {
            padding: 0 0 0 15px;
          }
          .user-modal__block-title {
            margin-left: -15px;
            padding-bottom: 5px;
            font-size: 18px;
          }
        `}</style>
      </div>
    )
  }
}

const mapStateToProps = ({ admin }) => ({
  user: admin.users.current || null
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getUserInfo,
  clearUserInfo
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AdminUserInfo)

import Link from 'next/link'
import Router from 'next/router'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'

import PageHoc from '../../client/hocs/Page'
import AdminLayout from '../../client/layouts/admin'

//
import Modal from '../../client/components/Modal'
import Pager from '../../client/components/Pager'
import Panel from '../../client/components/Panel'
import PanelSearch from '../../client/components/PanelSearch'
import UserInline from '../../client/components/User/Inline'

//
import { fetchUsers } from '../../client/redux/admin/users'

class AdminUsersPage extends Component {
  static async getInitialProps (ctx) {
    await ctx.store.dispatch(fetchUsers({}))
    return {}
  }

  onClose () {
    Router.push('/admin/users')
  }

  render () {
    let { items, total, limit, offset } = this.props.users
    let { userId } = this.props.url.query
    let searchString = ''

    return (
      <AdminLayout selected={'users'}>
        <div className='feed'>
          <Panel SubHeader={() => <PanelSearch absolute={false} placeholder={'Поиск по имени'} value={searchString} />}>
            <div className='pull-right'>
              <Pager panel total={total} current={offset + 1} limit={limit} onNavigate={() => {}} />
            </div>

            <div className='admin-entries-list'>
              { (items.length > 0) && items.map(el => (
                <div className='admin-entries-list__item' key={'user-' + el.id}>
                  <div className='user-admin-entry'>
                    <div className='user-admin-entry__block user-admin-entry__block_body'>
                      <UserInline user={el} />
                    </div>
                    <div className='user-admin-entry__block user-admin-entry__block_buttons'>
                      <div>
                        <Link href={`/admin/users?userId=${el.id}`} as={`/admin/users/${el.id}`}>
                          <a className=''>Инфо</a>
                        </Link>
                      </div>
                      <div>
                        <Link href={`/admin/users?userId=${el.id}`} as={`/admin/users/${el.id}`}>
                          <a className=''>Заблокировать</a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )) }
            </div>
          </Panel>

          <Pager total={total} current={offset + 1} limit={limit} onNavigate={() => {}} />

          <Modal isOpened={userId} onClose={this.onClose}>
            Информация о пользователе
          </Modal>
        </div>

        <style jsx>{`
          .admin-entries-list {}
          .admin-entries-list__item {
            padding: 10px;
          }
          .admin-entries-list__item:nth-child(even) {
            background-color: color(#ebebeb a(-40%));
          }

          .user-admin-entry {}
          .user-admin-entry__block {
            box-sizing: border-box;

            vertical-align: top;
            display: inline-block;
          }
          .user-admin-entry__block_body {
            width: 75%;
            padding-right: 10px;
          }
          .user-admin-entry__block_buttons {
            width: 25%;
            text-align: right;
          }
        `}</style>
      </AdminLayout>
    )
  }
}

// тут будет проверка через апи
const accessRule = user => !!user

const mapStateToProps = state => ({
  users: state.users
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchUsers
}, dispatch)

const mergeProps = (state, dispatch, props) => {
  const searchByName = async string => {
    await dispatch.fetchUsers({ search: string.replace(/(<([^>]+)>)/ig, '') })
  }

  return {
    ...state,
    ...dispatch,
    ...props,
    searchByName
  }
}

export default PageHoc(AdminUsersPage, {
  title: 'Управление пользователями',
  accessRule,
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
})

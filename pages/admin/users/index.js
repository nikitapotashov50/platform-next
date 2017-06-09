import Router from 'next/router'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import _ from 'lodash'

import PageHoc from '../../../client/hocs/Page'
import AdminLayout from '../../../client/layouts/admin'

import UsersList from '../../../client/components/Admin/Users/List'
import Modal from '../../../client/components/Modal'
import UserInfo from '../../../client/components/Admin/Users/Info'

//
import { fetchUsers, queryUpdate } from '../../../client/redux/admin/users'

const makeLink = userId => ({
  href: `/admin/users?userId=${userId}`,
  path: `/admin/users/${userId}`
})

class AdminUsersPage extends Component {
  static async getInitialProps (ctx) {
    let headers = null
    if (ctx.req) headers = ctx.req.headers

    await ctx.store.dispatch(fetchUsers({}, { headers }))
    return {}
  }

  constructor (props) {
    super(props)

    this.search = _.debounce(this.search.bind(this), 200)
    this.onSearchType = this.onSearchType.bind(this)
  }

  toggleInfo (userId = null, e) {
    e.preventDefault()
    let target = makeLink(userId)
    if (userId) Router.push(target.href, target.path, { shallow: true })
    else Router.push('/admin/users', '/admin/users', { shallow: true })
  }

  async search (value) {
    await this.props.fetchUsers({ searchString: value }, true)
  }

  async onSearchType (e) {
    e.preventDefault()
    let value = _.escape(e.target.value)
    await this.props.queryUpdate({ searchString: value })

    if (value.length > 2) this.search(value)
  }

  render () {
    let { users, total, query } = this.props
    let { userId } = this.props.url.query

    return (
      <AdminLayout selected={'users'}>
        <div className='feed'>
          <UsersList users={users} total={total} query={query} onSearch={this.onSearchType} onExpand={this.toggleInfo} />

          <Modal isOpened={userId} onClose={this.toggleInfo.bind(this, null)} width='500'>
            <UserInfo userId={userId} />
          </Modal>
        </div>
      </AdminLayout>
    )
  }
}

const accessRule = user => false

const mapStateToProps = ({ admin }) => ({
  users: admin.users.items,
  query: admin.users.query,
  total: admin.users.total
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchUsers,
  queryUpdate
}, dispatch)

const mergeProps = (state, dispatch, props) => {
  const fetchUsers = async (query, rewrite) => {
    await dispatch.queryUpdate(query, rewrite)
    await dispatch.fetchUsers({ ...(rewrite ? {} : state.query), ...query })
  }

  return {
    ...state,
    ...dispatch,
    ...props,
    fetchUsers,
    queryUpdate
  }
}

export default PageHoc(AdminUsersPage, {
  title: 'Управление пользователями',
  accessRule,
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
})

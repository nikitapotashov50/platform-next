import React, { Component } from 'react'

import { bindActionCreators } from 'redux'

import PageHoc from '../../client/hocs/Page'
import { isLogged } from '../../client/components/Access/isLogged'
import { searchUsers } from '../../client/redux/users'
import DefaultLayut from '../../client/layouts/default'

class SearchPage extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  componentWIllReceiveProps (nextProps) {
    if (this.props.program !== nextProps.program) this.props.searchUsers()
  }

  render () {
    return (
      <DefaultLayut>
        123
      </DefaultLayut>
    )
  }
}

SearchPage.getInitialProps = async ctx => {
  let headers = null
  if (ctx.isServer) headers = ctx.req.headers

  await ctx.store.dispatch(searchUsers({}, { headers }))

  return {}
}

const mapStateToProps = ({ users }) => ({ ...users })

const mapDispatchToProps = dispatch => bindActionCreators({
  searchUsers
}, dispatch)

const mergeProps = (state, dispatch, props) => ({
  ...state,
  ...props,
  searchUsers: dispatch.searchUsers
})

export default PageHoc(isLogged(SearchPage), {
  title: 'Поиск',
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
})

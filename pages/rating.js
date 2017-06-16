import React, { Component } from 'react'
import axios from 'axios'
import SearchIcon from 'react-icons/lib/fa/search'

import UserInline from '../client/components/User/Inline'
import Page from '../client/hocs/Page'
import Panel from '../client/elements/Panel'
import FeedLayout from '../client/layouts/feed'

class NPSRatings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchQuery: '',
      users: []
    }
  }

  async fetchUsers (searchQuery = '') {
    const { data } = await axios(`/api/mongo/rating?searchString=${searchQuery}`)
    return data.nps
  }

  async componentDidMount () {
    const users = await this.fetchUsers()

    this.setState({
      users: users
    })
  }

  render () {
    return (
      <FeedLayout>
        <Panel>
          <div className='rating-list'>

            <div style={{ display: 'flex' }}>
              <input
                type='text'
                placeholder='Поиск по имени или e-mail'
                onChange={e => {
                  this.setState({
                    searchQuery: e.target.value
                  })
                }}
                onKeyPress={async e => {
                  if (e.key === 'Enter') {
                    const users = await this.fetchUsers(this.state.searchQuery)
                    this.setState({
                      users
                    })
                  }
                }} />

              <button className='search' onClick={async () => {
                const users = await this.fetchUsers(this.state.searchQuery)
                this.setState({
                  users
                })
              }}>
                <SearchIcon className='icon' />
              </button>
            </div>

            <style jsx>{`
              .search {
                background: #f5f7fa;
                border-radius: 3px;
                padding: 10px 20px;
                cursor: pointer;
                margin-left: 3px;
                color: #9a9a9a;
                transition: all 0.2s ease;
              }

              .search:hover {
                background: #196aff;
                color: #fff;
              }
            `}</style>

            {this.state.users.map(user => (
              <div className='rating-list__item' key={user._id}>
                <UserInline user={Object.assign({}, user, { occupation: 'lul' })} />
                <div>{user.total}</div>
              </div>
            ))}
          </div>
        </Panel>

      </FeedLayout>
    )
  }
}

export default Page(NPSRatings, {
  title: 'Рейтинг NPS'
})
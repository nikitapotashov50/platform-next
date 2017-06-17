import React, { Component } from 'react'
import axios from 'axios'
import SearchIcon from 'react-icons/lib/fa/search'
import SortAscIcon from 'react-icons/lib/fa/sort-amount-asc'
import SortDescIcon from 'react-icons/lib/fa/sort-amount-desc'

import UserInline from '../client/components/User/Inline'
import Page from '../client/hocs/Page'
import Panel from '../client/elements/Panel'
import FeedLayout from '../client/layouts/feed'

class NPSRatings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchQuery: '',
      users: [],
      limit: 100,
      order: -1
    }
  }

  async fetchUsers (searchQuery = '', order = -1) {
    const { data } = await axios('/api/mongo/rating', {
      params: {
        searchString: this.state.searchQuery,
        order: this.state.order
      }
    })
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
              <button className='sort-button' onClick={async () => {
                const order = Number(this.state.order) * -1
                const users = await this.fetchUsers(this.state.searchQuery, order)
                this.setState({
                  users,
                  order
                })
              }}>
                {this.state.order === 1 ? <SortAscIcon /> : <SortDescIcon />}
              </button>

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
              .sort-button {
                background: #196aff;
                color: #fff;
                border-radius: 3px;
                padding: 10px 20px;
                cursor: pointer;
                margin-right: 3px;
              }

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
                <UserInline user={user} />
                <div className='nps'>{user.total && Math.round(user.total * 100) / 100}</div>
              </div>
            ))}

            <style jsx>{`
              .rating-list__item {
                margin: 20px 0 0;
                display: flex;
                justify-content: space-between;
              }

              .nps {
                font-size: 20px;
                font-weight: bold;
              }
            `}</style>
          </div>
        </Panel>

      </FeedLayout>
    )
  }
}

export default Page(NPSRatings, {
  title: 'Рейтинг'
})

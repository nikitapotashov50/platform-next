import React, { Component } from 'react'
import axios from 'axios'
import SearchIcon from 'react-icons/lib/fa/search'

import PageHoc from '../client/hocs/Page'
import UserInline from '../client/components/User/Inline'
import Panel from '../client/elements/Panel'
import FeedLayout from '../client/layouts/feed'

class SearchPage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      limit: 60,
      users: [],
      query: ''
    }

    this.search = this.search.bind(this)
  }

  async search () {
    if (!this.state.query) return

    const { data } = await axios('/api/mongo/users/list', {
      params: {
        limit: this.state.limit,
        searchString: this.state.query
      }
    })

    this.setState({
      users: data.result.users
    })
  }

  render () {
    return (
      <FeedLayout>
        <Panel>
          <div className='search-container'>
            <input
              type='text'
              placeholder='Поиск по имени и email'
              value={this.state.query}
              onChange={e => { this.setState({ query: e.target.value }) }}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  this.search()
                }
              }} />
            <button className='search-button' onClick={this.search}>
              <SearchIcon className='icon' />
            </button>
          </div>

          <div>
            {this.state.users.map(user => (
              <div className='user' key={user._id}>
                <UserInline user={user} />
              </div>
            ))}
          </div>

          <style jsx>{`
            .search-container {
              display: flex;
            }

            .search-container > input {
              border-radius: 3px;
              padding-right: 20px;
              font-size: 16px;
            }

            .search-button{
              background: #f5f7fa;
              border-radius: 3px;
              padding: 10px 20px;
              cursor: pointer;
              margin-left: 3px;
              color: #9a9a9a;
              transition: all 0.2s ease;
            }

            .search-button:hover {
              background: #196aff;
              color: #fff;
            }

            .user {
              margin: 10px 0;
            }
          `}</style>
        </Panel>
      </FeedLayout>
    )
  }
}

export default PageHoc(SearchPage, {
  title: 'Поиск'
})

import React, { Component } from 'react'
import axios from 'axios'

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

import React, { Component } from 'react'
import fetch from 'isomorphic-unfetch'

class IndexPage extends Component {
  // static async getInitialProps () {
    // const res = await fetch('https://api.github.com/repos/zeit/next.js')
    // const json = await res.json()
    // return { stars: json.stargazers_count }
  // }
  constructor (props) {
    super(props)
    this.state = {}
    this.handler = this.handler.bind(this)
  }

  async handler () {
    fetch('/api/login', {
      method: 'post',
      body: JSON.stringify({
        login: this.state.login
      })
    })
  }

  render () {
    return (
      <div>
        <h1>Главная</h1>
        <input type='text' placeholder='Логин' onChange={e => this.setState({ login: e.target.value })} />
        <button onClick={this.handler}>ВОЙТИ</button>
      </div>
    )
  }
}

export default IndexPage

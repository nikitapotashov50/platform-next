import React, { Component } from 'react'
import Link from 'next/link'
import DefaultLayout from '../client/layouts/default'

class IndexPage extends Component {
  render () {
    return (
      <div>
        Главная
        <Link href='/posts' prefetch><a>Посты</a></Link>
      </div>
    )
  }
}

export default DefaultLayout(IndexPage)

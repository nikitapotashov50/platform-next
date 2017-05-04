import React, { Component } from 'react'
import Link from 'next/link'
import Page from '../components/hocs/Page'

class IndexPage extends Component {
  render () {
    return <div>
      Главная
      <Link href='/posts' prefetch><a>Посты</a></Link>
    </div>
  }
}

export default Page(IndexPage)

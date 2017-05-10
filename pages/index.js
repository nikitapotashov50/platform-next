import Link from 'next/link'
import React, { Component } from 'react'

import Page from '../client/hocs/Page'
import DefaultLayout from '../client/layouts/default'

class IndexPage extends Component {
  render () {
    return (
      <DefaultLayout>
        Главная
        <Link href='/posts' prefetch><a>Посты</a></Link>&nbsp;
        <Link href='/user/settings?username=paperdoll' as='/settings' prefetch><a>Юзер сеттингс</a></Link>&nbsp;
        <Link href='/user?username=paperdoll' as='/@bm-paperdoll' prefetch><a>Юзер</a></Link>
      </DefaultLayout>
    )
  }
}

export default Page(IndexPage)

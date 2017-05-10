import Page from '../../client/hocs/Page'
import Access from '../../client/hocs/Access'

import DefaultLayout from '../../client/layouts/default'

const AdminIndexPage = props => {
  return (
    <DefaultLayout>
      Admin panel
    </DefaultLayout>
  )
}

let accessRule = user => true

export default Page(Access(accessRule)(AdminIndexPage))

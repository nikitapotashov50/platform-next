import Page from '../../client/hocs/Page'

import DefaultLayout from '../../client/layouts/default'

const AdminIndexPage = props => {
  return (
    <DefaultLayout>
      Admin panel
    </DefaultLayout>
  )
}

let accessRule = user => !!user

export default Page(AdminIndexPage, {
  accessRule
})

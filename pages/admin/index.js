import Panel from '../../client/elements/Panel'
import Page from '../../client/hocs/Page'

import AdminLayout from '../../client/layouts/admin'

const AdminIndexPage = props => {
  return (
    <AdminLayout>
      <div className='feed'>
        <div className='feed__left'>
          <Panel>
            Dashboard
          </Panel>
        </div>
        <div className='feed__right'>
          <Panel>
            Side panel with parameters
          </Panel>
          <Panel>
            Side panel with parameters
          </Panel>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Page(AdminIndexPage, {})

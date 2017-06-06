import PageHoc from '../../../client/hocs/Page'
import AdminLayout from '../../../client/layouts/admin'

const AdminUserPage = props => (
  <AdminLayout selected={'users'}>
    123
  </AdminLayout>
)

export default PageHoc(AdminUserPage, {
  title: ''
})

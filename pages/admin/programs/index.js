import axios from 'axios'
import Link from 'next/link'

import isAdmin from '../../../client/components/Access/isAdmin'

import PageHoc from '../../../client/hocs/Page'
import Panel from '../../../client/elements/Panel'
import AdminLayout from '../../../client/layouts/admin'

const AdminPrograms = ({ data }) => (
  <AdminLayout selected={'programs'}>
    <br />
    <Panel>
      { (data.length !== 0) && data.map(el => (
        <div key={'programs-list-' + el._id}>
          {el.title} {el._id}

          <Link href={'/admin/programs/program?programId=' + el._id} as={'/admin/programs/' + el._id}>
            <a>Информация</a>
          </Link>
        </div>
      ))}
    </Panel>
  </AdminLayout>
)

AdminPrograms.getInitialProps = async ctx => {
  let { data } = await axios.get(`${BACKEND_URL}/api/mongo/admin/programs/list/`, { headers: ctx.req.headers })
  return { data: data.result.programs }
}

export default PageHoc(isAdmin(AdminPrograms), {
  title: 'Управление программами'
})

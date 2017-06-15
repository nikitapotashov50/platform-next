import axios from 'axios'

import isAdmin from '../../../../client/components/Access/isAdmin'

import PageHoc from '../../../../client/hocs/Page'
import Panel from '../../../../client/elements/Panel'
import PanelMenu from '../../../../client/components/PanelMenu'
import PanelTitle from '../../../../client/elements/Panel/Title'
import AdminLayout from '../../../../client/layouts/admin'

let getMenuItems = programId => ([
  { code: 'tasks', href: `/admin/programs/program/tasks?programId=${programId}`, path: `/admin/programs/${programId}/tasks`, title: 'Задания' }
])

const AdminPrograms = ({ program }) => {
  if (!program) return null

  let SubHeader = (
    <div>
      <div>Старт программы: {program.start_at}</div>
      <div>Окончание программы: {program.finish_at}</div>
    </div>
  )

  return (
    <AdminLayout selected={'programs'}>
      <br />
      <Panel Header={<PanelTitle title={program.title} />} SubHeader={SubHeader} bodyStyles={{ noPadding: true }}>
        <PanelMenu items={getMenuItems(program._id)} selected={'tasks'} />
      </Panel>

      <Panel>
        1231
      </Panel>
    </AdminLayout>
  )
}

AdminPrograms.getInitialProps = async ctx => {
  let { data } = await axios.get(`${BACKEND_URL}/api/mongo/admin/programs/` + ctx.query.programId, { headers: ctx.req.headers })
  return { program: data.result.program }
}

export default PageHoc(isAdmin(AdminPrograms), {
  title: 'Управление программами'
})

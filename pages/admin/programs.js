import axios from 'axios'

import { server } from '../../config'
import PageHoc from '../../client/hocs/Page'
import Panel from '../../client/components/Panel'
import DefaultLayout from '../../client/layouts/default'

const AdminPrograms = ({ data }) => (
  <DefaultLayout>
    <Panel>
      { (data.length !== 0) && data.map(el => (
        <div key={'programs-list-' + el.id}>
          {el.title}
        </div>
      ))}
    </Panel>
  </DefaultLayout>
)

AdminPrograms.getInitialProps = async ctx => {
  let { data } = await axios.get(`https://platform.molodost.bz/api/admin/programs/list/`)
  return { data: data.programs }
}

export default PageHoc(AdminPrograms, {
  title: 'Управление программами'
})

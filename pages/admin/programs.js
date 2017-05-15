import axios from 'axios'

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
  let { data, status } = await axios.get('http://dev2.molodost.bz:3000/api/admin/programs/list/')
  return { data: data.programs }
}

export default PageHoc(AdminPrograms, {
  title: 'Управление программами'
})

import PageHoc from '../../client/hocs/Page'
import DefaultLayout from '../../client/layouts/default'

const GroupPage = props => (
  <DefaultLayout>
    Group page
  </DefaultLayout>
)

export default PageHoc(GroupPage, {
  title: 'Группы'
})

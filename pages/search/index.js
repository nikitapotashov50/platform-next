import PageHoc from '../../client/hocs/Page'
import { isLogged } from '../../client/components/Access/isLogged'

import DefaultLayut from '../../client/layouts/default'

const SearchPage = props => (
  <DefaultLayut>
    123
  </DefaultLayut>
)

export default PageHoc(isLogged(SearchPage), {
  title: 'Поиск'
})

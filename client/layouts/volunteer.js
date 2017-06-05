import DefaultLayout from './default'
import Panel from '../elements/Panel'
import PanelMenu from '../components/PanelMenu'

let menuItems = [
  { code: 'tasks', href: '/volunteer/tasks', path: '/volunteer/tasks', title: 'Проверка заданий' },
  { code: 'groups', href: '/volunteer/groups', path: '/volunteer/groups', title: 'Полки и сотни' }
]

const FeedLayout = ({ children, Side = [], subMenu = null, subSelected = null, selected = null }) => {
  let SubHeader = null
  if (subMenu) SubHeader = <PanelMenu items={subMenu} selected={subSelected} />

  return (
    <DefaultLayout menuItem='volunteer'>
      <Panel
        noBody
        noBorder
        menuStyles={{ noBorder: true }}
        subHeaderStyles={{ noPadding: true }}
        Menu={() => <PanelMenu items={menuItems} selected={selected} />}
        SubHeader={SubHeader}
      />

      {children}
    </DefaultLayout>
  )
}

export default FeedLayout

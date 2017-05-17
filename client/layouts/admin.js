import DefaultLayout from './default'
import Panel from '../components/Panel'
import PanelMenu from '../components/PanelMenu'

let items = [
  { code: 'index', path: '/admin', href: '/admin', title: 'Главная' },
  { code: 'users', path: '/admin/users', href: '/admin/users', title: 'Пользователи' },
  { code: 'programs', path: '/admin/programs', href: '/admin/programs', title: 'Программы' },
  { code: 'nps', path: '/admin/feedback', href: '/admin/feedback', title: 'NPS' }
]

const ADminLayout = ({ children, selected = 'index', ...props }) => (
  <DefaultLayout>
    <Panel noBody noBorder noMargin Menu={() => <PanelMenu items={items} selected={selected} />} />
    {children}
  </DefaultLayout>
)

export default ADminLayout

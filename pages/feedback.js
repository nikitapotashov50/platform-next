import PanelMenu from '../client/components/PanelMenu'
import PageHoc from '../client/hocs/Page'
import AccessHoc from '../client/hocs/Access'
import Panel from '../client/components/Panel'
import FeedLayout from '../client/layouts/feed'

const menuItems = [
  { code: 'program', href: '/', path: '/', title: 'Программа' },
  { code: 'coach', href: '/', path: '/', title: 'Тренерская группа' },
  { code: 'platfrom', href: '/', path: '/', title: 'О платформе' }
]

const FeedbackPage = props => (
  <FeedLayout emptySide>
    <Panel
      Menu={() => <PanelMenu items={menuItems} selected={'program'} />}
    >
      <div>Hello world</div>
    </Panel>  
  </FeedLayout>
)

const rule = user => !!user

let AccessedPage = AccessHoc(rule)(FeedbackPage)

export default PageHoc(AccessedPage, {
  title: 'Оставить отзыв'
})
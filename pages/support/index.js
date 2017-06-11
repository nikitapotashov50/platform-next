import PageHoc from '../../client/hocs/Page'
import DefaultLayout from '../../client/layouts/default'
import Panel from '../../client/elements/Panel'
import PanelMenu from '../../client/components/PanelMenu'
import PanelTitle from '../../client/elements/Panel/Title'

const menuItems = [
  { href: '/support', path: '/support', title: 'FAQ', code: 'faq' },
  { href: '/support?tab=report', path: '/support/report', title: 'Обращение', code: 'report' }
]

const SupportPage = ({ tab }) => (
  <DefaultLayout>
    <div className='feed'>
      <Panel noBody Header={<PanelTitle title='Служба поддержки' small />} Menu={() => <PanelMenu items={menuItems} selected={tab} />} />
      {tab}
    </div>
  </DefaultLayout>
)

SupportPage.getInitialProps = ctx => ({ tab: ctx.query.tab || 'faq' })

export default PageHoc(SupportPage, {
  title: 'Поддержка'
})

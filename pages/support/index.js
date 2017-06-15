import PageHoc from '../../client/hocs/Page'
import DefaultLayout from '../../client/layouts/default'
import Panel from '../../client/elements/Panel'
import PanelMenu from '../../client/components/PanelMenu'
import PanelTitle from '../../client/elements/Panel/Title'

import FaqList from '../../client/elements/Faq/Container'

const menuItems = [
  { href: '/support', path: '/support', title: 'FAQ', code: 'faq' }
  // { href: '/support?tab=report', path: '/support/report', title: 'Обращение', code: 'report' }
]

let faqItems = [
  { title: 'У меня нет доступа в ЦЕХ', content: 'Пожалуйста, напишите на почту help@molodost.bz' },
  { title: 'Как выполнять домашние задания?', content: 'Перейдите на вкладку «Задания» в верхнем меню и нажмите «Выполнить» у любого из заданий. На открывшейся странице заполните поля — ответ к заданию — и нажмите «Ответить на задание».' },
  { title: 'Что делать, если у меня нет вкладки «Задания»?', content: 'Убедитесь, что выбран текущий курс (ЦЕХ или МЗС) и вы не находитесь в «Общей ленте». В верхнем меню есть переключатель курсов.' },
  { title: 'Как написать ежедневный отчет?', content: 'На главной странице платформы (на вкладке «Отчеты»), либо у себя в профиле кликните на поле «Написать отчет за сегодня» сверху страницы. Заполните заголовок и сам отчет, нажмите кнопку «Отправить».' }
]

const SupportPage = ({ tab }) => (
  <DefaultLayout>
    <div className='feed'>
      <Panel noBody Header={<PanelTitle title='Служба поддержки' small />} Menu={() => <PanelMenu items={menuItems} selected={tab} />} />

      <FaqList items={faqItems} />
    </div>
  </DefaultLayout>
)

SupportPage.getInitialProps = ctx => ({ tab: ctx.query.tab || 'faq' })

export default PageHoc(SupportPage, {
  title: 'Поддержка'
})

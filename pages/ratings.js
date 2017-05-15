import PageHoc from '../client/hocs/Page'
import Panel from '../client/components/Panel'
import FeedLayout from '../client/layouts/feed'
import PanelMenu from '../client/components/PanelMenu'
import UserInline from '../client/components/User/Inline'
import PanelSearch from '../client/components/PanelSearch'

const menuItems = [
  { href: '/', path: '/', title: 'Все', code: 'index' },
  { href: '/', path: '/', title: 'Десятки', code: 'index4' },
  { href: '/', path: '/', title: 'Сотни', code: 'index5' },
  { href: '/', path: '/', title: 'Полки', code: 'index2' },
  { href: '/', path: '/', title: 'Тренера', code: 'index3' },
  { href: '/', path: '/', title: 'Спикеры', code: 'index6' }
]

const subMenu = [
  { href: '/', path: '/', title: 'Лучшие', code: 'index7' },
  { href: '/', path: '/', title: 'Моя десятка', code: 'index8' },
  { href: '/', path: '/', title: 'Моя группа', code: 'index9' }
]

const RatingsPage = props => {
  let subHeaderStyles = { noPadding: true }
  let panelProps = { subHeaderStyles, menuStyles: { noBorder: true } }

  panelProps.Menu = () => <PanelMenu items={menuItems} selected={'index'} />
  panelProps.SubHeader = () => (
    <div>
      <PanelMenu items={subMenu} selected={'index7'} />
      <PanelSearch placeholder={'Поиск по имени'} />
    </div>
  )

  return (
    <FeedLayout>
      <Panel {...panelProps}>
        <div className='rating-list'>
          <div className='rating-list__item'>
            <UserInline money={123123} user={{ name: 'bm-paperdoll', first_name: 'Степан', last_name: 'Юринов' }} />
          </div>

          <div className='rating-list__item'>
            <UserInline money={123123} user={{ name: 'bm-paperdoll', first_name: 'Степан', last_name: 'Юринов' }} />
          </div>

          <div className='rating-list__item'>
            <UserInline money={123123} user={{ name: 'bm-paperdoll', first_name: 'Степан', last_name: 'Юринов' }} />
          </div>

          <div className='rating-list__item'>
            <UserInline money={123123} user={{ name: 'bm-paperdoll', first_name: 'Степан', last_name: 'Юринов' }} />
          </div>
        </div>
      </Panel>
    </FeedLayout>
  )
}

export default PageHoc(RatingsPage, {
  title: 'Рейтинги'
})
// <div class="panel-menu" slot="menu">
//         <div class="panel-menu__item panel-menu__item_bordered" v-for="(item, key) in categories">
//           <nuxt-link :class="{ 'panel-menu__link': true, 'panel-menu__link_active': key === tab }" :to="{ name: 'rating-category', params: { category: item.path || key  } }">{{ item.title }}</nuxt-link >
//         </div>
//       </div>

//       <div class="panel-menu" v-if="subCategories" slot="sub-header">
//         <div class="panel-menu__item" v-for="(item, key) in subCategories">
//           <nuxt-link :class="{ 'panel-menu__link': true, 'panel-menu__link_active': key === tab }" :to="{ name: 'rating-category', params: { category: item.path || key  } }">{{ item.title }}</nuxt-link >
//         </div>
        
//         <div class="panel-search">
//           <input class="panel-search__input" type="text" placeholder="Поиск по имени" />
//         </div>
//       </div>

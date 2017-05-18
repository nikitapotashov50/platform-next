import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { loadRatings } from '../client/redux/ratings'

import PageHoc from '../client/hocs/Page'
import Panel from '../client/components/Panel'
import FeedLayout from '../client/layouts/feed'
import PanelMenu from '../client/components/PanelMenu'
import UserInline from '../client/components/User/Inline'
import PanelSearch from '../client/components/PanelSearch'

const menuItems = [
  { href: '/ratings?tab=all', path: '/ratings/all', title: 'Все', code: 'all' },
  { href: '/ratings?tab=ten', path: '/ratings/ten', title: 'Десятки', code: 'ten' },
  { href: '/ratings?tab=hundred', path: '/ratings/hundred', title: 'Сотни', code: 'hundred' },
  { href: '/ratings?tab=squad', path: '/ratings/squad', title: 'Полки', code: 'squad' },
  { href: '/ratings?tab=coaches', path: '/ratings/coaches', title: 'Тренера', code: 'coaches' },
  { href: '/ratings?tab=speakers', path: '/ratings/speakers', title: 'Спикеры', code: 'speakes' }
]

const subMenu = [
  { href: '/ratings?tab=all', path: '/ratings/all', title: 'Лучшие', code: 'all' },
  { href: '/ratings?tab=myten', path: '/ratings/myten', title: 'Моя десятка', code: 'myten' },
  { href: '/ratings?tab=mygroup', path: '/ratings/mygroup', title: 'Моя группа', code: 'mygroup' }
]

class RatingsPage extends Component {
  componentDidMount () {
    console.log(this.props.url.query.tab)
    console.log(this.props.userId)
    this.props.loadRatings(this.props.url.query.tab, this.props.program)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.url.query.tab !== this.props.url.query.tab) {
      if (nextProps.url.query.tab === 'all') {
        this.props.loadRatings('all', this.props.program)
      }
      if (nextProps.url.query.tab === 'ten') {
        this.props.loadRatings('ten', this.props.program)
      }
      if (nextProps.url.query.tab === 'hundred') {
        this.props.loadRatings('hundred', this.props.program)
      }
      if (nextProps.url.query.tab === 'squad') {
        this.props.loadRatings('squad', this.props.program)
      }
      if (nextProps.url.query.tab === 'coaches') {
        this.props.loadRatings('coaches', this.props.program)
      }
      if (nextProps.url.query.tab === 'myten') {
        this.props.loadRatings('myten', this.props.program, this.props.userId)
      }
      if (nextProps.url.query.tab === 'mygroup') {
        this.props.loadRatings('mygroup', this.props.program, this.props.userId)
      }
    }
    if (this.props.program !== nextProps.program) {
      this.props.loadRatings(this.props.url.query.tab, nextProps.program)
    }
  }

  render () {
    let subHeaderStyles = { noPadding: true }
    let panelProps = { subHeaderStyles, menuStyles: { noBorder: true } }

    panelProps.Menu = () => <PanelMenu items={menuItems} selected={this.props.url.query.tab || 'index'} />
    panelProps.SubHeader = () => {
      if (['all', 'myten', 'mygroup'].includes(this.props.url.query.tab) || !this.props.url.query.tab) {
        return (
          <div>
            <PanelMenu items={subMenu} selected={this.props.url.query.tab || 'index7'} />
            <PanelSearch placeholder={'Поиск по имени'} />
          </div>
        )
      }
      return null
    }
    return (
      <FeedLayout>
        <Panel {...panelProps}>
          <div className='rating-list'>
            {this.props.ratings.map(rating => (<div className='rating-list__item' key={rating.id}>
              <UserInline money={rating.money} user={{
                name: rating.name || rating.id,
                first_name: rating.first_name || rating.title.split(' ')[0],
                last_name: rating.last_name || rating.title.slice(rating.title.indexOf(' ')),
                picture_small: rating.picture_small
              }} />
            </div>))}
          </div>
        </Panel>
      </FeedLayout>
    )
  }
}

export default PageHoc(RatingsPage, {
  title: 'Рейтинги',
  mapStateToProps: state => ({
    userId: state.auth.user.id,
    program: state.user.programs.current,
    ratings: state.ratings.ratings
  }),
  mapDispatchToProps: dispatch => bindActionCreators({
    loadRatings
  }, dispatch)
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

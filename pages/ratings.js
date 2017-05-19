import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { loadRatings } from '../client/redux/ratings'

import PageHoc from '../client/hocs/Page'
import Panel from '../client/components/Panel'
import FeedLayout from '../client/layouts/feed'
import PanelMenu from '../client/components/PanelMenu'
import UserInline from '../client/components/User/Inline'
import PanelSearch from '../client/components/PanelSearch'
// import SpeakersRating from '../client/components/Rating/Speakers'

const menuItems = [
  { href: '/ratings?tab=all', path: '/ratings/all', title: 'Все', code: 'all' },
  { href: '/ratings?tab=tens', path: '/ratings/tens', title: 'Десятки', code: 'tens' },
  { href: '/ratings?tab=hundreds', path: '/ratings/hundreds', title: 'Сотни', code: 'hundreds' },
  { href: '/ratings?tab=polks', path: '/ratings/polks', title: 'Полки', code: 'polks' },
  { href: '/ratings?tab=coaches', path: '/ratings/coaches', title: 'Тренера', code: 'coaches' },
  { href: '/ratings?tab=speakers', path: '/ratings/speakers', title: 'Спикеры', code: 'speakes' }
]

const subMenu = [
  { href: '/ratings?tab=all', path: '/ratings/all', title: 'Лучшие', code: 'all' },
  { href: '/ratings?tab=myten', path: '/ratings/myten', title: 'Моя десятка', code: 'myten' },
  { href: '/ratings?tab=mygroup', path: '/ratings/mygroup', title: 'Моя группа', code: 'mygroup' }
]

class RatingsPage extends Component {
  constructor () {
    super()
    this.handleSearchInput = this.handleSearchInput.bind(this)
  }

  componentDidMount () {
    this.props.loadRatings(this.props.url.query.tab, this.props.program)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.url.query.tab !== this.props.url.query.tab) {
      if (nextProps.url.query.tab === 'all') {
        this.props.loadRatings('all', this.props.program)
      }
      if (nextProps.url.query.tab === 'tens') {
        this.props.loadRatings('tens', this.props.program)
      }
      if (nextProps.url.query.tab === 'hundreds') {
        this.props.loadRatings('hundreds', this.props.program)
      }
      if (nextProps.url.query.tab === 'polks') {
        this.props.loadRatings('polks', this.props.program)
      }
      // пока еще не реализовано
      // if (nextProps.url.query.tab === 'polk') {
      //   this.props.loadRatings('polk', this.props.program, nextProps.url.query.id)
      // }
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

  handleSearchInput (event) {
    event.preventDefault()
    this.props.loadRatings('search', this.props.program, this.searchInput.value)
  }

  render () {
    const link = rating => {
      if (rating.first_name) {
        return {
          href: `/user?username=${rating.name}`,
          path: `/@${rating.name}`
        }
      }
      if (rating.GameGroups) {
        return {
          href: `/ratings?tab=${rating.GameGroups[0].type}&id=${rating.id}`,
          path: `/ratings/${rating.GameGroups[0].type}/${rating.id}`
        }
      }
      if (rating.CoachGroups) {
        return {
          href: `/ratings?tab=coach&id=${rating.id}`,
          path: `/ratings/coach/${rating.id}`
        }
      }
      return {
        href: '', path: ''
      }
    }

    let subHeaderStyles = { noPadding: true }
    let panelProps = { subHeaderStyles, menuStyles: { noBorder: true } }

    panelProps.Menu = () => <PanelMenu items={menuItems} selected={this.props.url.query.tab || 'index'} />
    panelProps.SubHeader = () => {
      if (['all', 'myten', 'mygroup'].includes(this.props.url.query.tab) || !this.props.url.query.tab) {
        return (
          <div>
            <PanelMenu items={subMenu} selected={this.props.url.query.tab || 'all'} />
            <PanelSearch placeholder={'Поиск по имени'} searchInput={e => (this.searchInput = e)} onSubmit={this.handleSearchInput} />
          </div>
        )
      }
      return null
    }
    // if (this.props.url.query.tab === 'speakers') {
    //   return (
    //     <FeedLayout>
    //       <Panel {...panelProps}>
    //         <SpeakersRating ratings={this.props.ratings} />
    //       </Panel>
    //     </FeedLayout>
    //   )
    // }
    return (
      <FeedLayout>
        <Panel {...panelProps}>
          <div className='rating-list'>
            {this.props.ratings.map(rating => (<div className='rating-list__item' key={rating.id}>
              <UserInline money={rating.money}
                picture={rating.picture_small}
                title={rating.title || rating.first_name + ' ' + rating.last_name}
                link={link(rating)}
                small />
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

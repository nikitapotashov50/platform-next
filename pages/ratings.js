import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import Waypoint from 'react-waypoint'
import { loadRatings, loadSpeakers, searchUsers, loadMore } from '../client/redux/ratings'

import PageHoc from '../client/hocs/Page'
import Panel from '../client/components/Panel'
import FeedLayout from '../client/layouts/feed'
import PanelMenu from '../client/components/PanelMenu'
import GroupInline from '../client/components/Group/Inline'
import UserInline from '../client/components/User/Inline'
import PanelSearch from '../client/components/PanelSearch'
import SpeakersRating from '../client/components/Rating/Speakers'

const menuItems = [
  { href: '/ratings?tab=all', path: '/ratings/all', title: 'Все', code: 'all' },
  { href: '/ratings?tab=tens', path: '/ratings/tens', title: 'Десятки', code: 'tens' },
  { href: '/ratings?tab=hundreds', path: '/ratings/hundreds', title: 'Сотни', code: 'hundreds' },
  { href: '/ratings?tab=polks', path: '/ratings/polks', title: 'Полки', code: 'polks' },
  { href: '/ratings?tab=cities', path: '/ratings/cities', title: 'Города', code: 'cities' },
  { href: '/ratings?tab=coaches', path: '/ratings/coaches', title: 'Тренера', code: 'coaches' },
  { href: '/ratings?tab=speakers', path: '/ratings/speakers', title: 'Спикеры', code: 'speakers' }
]

const subMenu = [
  { href: '/ratings?tab=all', path: '/ratings/all', title: 'Лучшие', code: 'all' },
  { href: '/ratings?tab=myten', path: '/ratings/myten', title: 'Моя десятка', code: 'myten' },
  { href: '/ratings?tab=mygroup', path: '/ratings/mygroup', title: 'Моя группа', code: 'mygroup' }
]

class RatingsPage extends Component {
  constructor () {
    super()
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.loadMore = this.loadMore.bind(this)
    this.state = {
      searchInput: '',
      offset: 0
    }
  }

  componentDidMount () {
    this.props.loadRatings({
      tab: this.props.url.query.tab,
      program: this.props.program,
      userId: this.props.userId
    })
    this.props.loadSpeakers({ program: this.props.program })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.url.query.tab !== this.props.url.query.tab && nextProps.url.query.tab === 'speakers') {
      return this.props.loadSpeakers({ program: this.props.program })
    }
    if (nextProps.url.query.tab !== this.props.url.query.tab || nextProps.program !== this.props.program) {
      return this.props.loadRatings({
        tab: nextProps.url.query.tab !== this.props.url.query.tab ? nextProps.url.query.tab : this.props.url.query.tab,
        program: this.props.program !== nextProps.program ? nextProps.program : this.props.program,
        userId: this.props.userId
      })
    }
  }

  handleChange (e) {
    this.setState({ searchInput: e.target.value })
  }

  handleSearchSubmit (event) {
    event.preventDefault()
    this.props.searchUsers({
      program: this.props.program,
      searchInput: this.state.searchInput
    })
  }

  loadMore () {
    this.setState({offset: this.state.offset + 1}, () => this.props.loadMore({
      program: this.props.program,
      searchInput: this.state.searchInput,
      offset: this.state.offset
    }))
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
    panelProps.SubHeader = ['all', 'myten', 'mygroup'].includes(this.props.url.query.tab) || !this.props.url.query.tab ? (
      <div>
        <PanelMenu items={subMenu} selected={this.props.url.query.tab || 'all'} />
        <PanelSearch
          placeholder={'Поиск по имени/нише'}
          searchInput={this.state.searchInput}
          handleChange={this.handleChange}
          handleSubmit={this.handleSearchSubmit} />
      </div>
    ) : null
    if (this.props.url.query.tab === 'speakers') {
      return (
        <FeedLayout>
          <Panel {...panelProps}>
            <div className='rating-list'>
              <SpeakersRating speakers={this.props.speakers} />
            </div>
          </Panel>
        </FeedLayout>
      )
    }

    return (
      <FeedLayout>
        <Panel {...panelProps} >
          <div className='rating-list'>
            {this.props.ratings.map(rating => (
              <div className='rating-list__item' key={rating.id}>
                {rating.first_name ? <UserInline user={rating} /> : <GroupInline money={rating.money}
                  picture={rating.picture_small}
                  title={rating.title}
                  link={link(rating)}
                  small />}
              </div>))}
            {this.state.searchInput && <Waypoint onEnter={this.loadMore} />}
          </div>
        </Panel>
      </FeedLayout>
    )
  }
}

export default PageHoc(RatingsPage, {
  title: 'Рейтинги',
  accessRule: () => false,
  mapStateToProps: state => ({
    userId: state.auth.user.id,
    program: state.user.programs.current,
    ratings: state.ratings.ratings,
    speakers: state.ratings.speakers,
    offset: state.ratings.offset
  }),
  mapDispatchToProps: dispatch => bindActionCreators({
    loadRatings,
    loadSpeakers,
    searchUsers,
    loadMore
  }, dispatch)
})

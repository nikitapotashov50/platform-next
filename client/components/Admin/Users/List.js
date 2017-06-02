import ListEntry from './ListEntry'
import Pager from '../../Pager'
import Panel from '../../Panel'

import PanelSearch from '../../PanelSearch'
import PanelTitle from '../../Panel/Title'

export default ({ users, query, total, onExpand, onSearch }) => {
  let SubHeader = (
    <div>
      <PanelTitle title='Список пользователей' />
      <PanelSearch absolute={false} placeholder='Поиск по имени' value={query.searchString} handleChange={onSearch} />
    </div>
  )

  return (
    <div>
      <Panel SubHeader={SubHeader}>
        <div className='pull-right'>
          <Pager panel total={total} current={query.offset + 1} limit={query.limit} onNavigate={() => {}} />
        </div>

        <div className='admin-entries-list'>
          { (users && users.length > 0) && users.map(user => (
            <div className='admin-entries-list__item' key={'user-' + user._id}>
              <ListEntry user={user} onClick={onExpand.bind(this, user._id)} />
            </div>
          )) }
        </div>
      </Panel>

      <Pager total={total} current={query.offset + 1} limit={query.limit} onNavigate={() => {}} />

      <style jsx>{`
        .admin-entries-list {}
        .admin-entries-list__item {
          padding: 10px;
        }
        .admin-entries-list__item:nth-child(even) {
          background-color: color(#ebebeb a(-70%));
        }
      `}</style>
    </div>
  )
}

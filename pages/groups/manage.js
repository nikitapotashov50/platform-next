import PageHoc from '../../client/hocs/Page'
import DefaultLayout from '../../client/layouts/default'

import Panel from '../../client/elements/Panel'
import PanelTitle from '../../client/elements/Panel/Title'
import PanelSearch from '../../client/components/PanelSearch'

import isLogged from '../../client/components/Access/isLogged'

const GroupPage = props => {
  let SubHeader = (
    <div>
      <PanelTitle small title='Список пользователей' />
      <PanelSearch absolute={false} placeholder='Поиск по имени' value={''} handleChange={() => {}} />
    </div>
  )

  return (
    <DefaultLayout>
      <div className='group-manage'>
        <div className='group-manage__block group-manage__block_list'>
          <Panel SubHeader={SubHeader} />
        </div>

        <div className='group-manage__block group-manage__block_group'>
          <Panel />
        </div>
      </div>

      <style>{`
        .group-manage {
          margin: 0 -7.5px;
          padding-top: 10px;
        }
        .group-manage__block {
          box-sizing: border-box;

          padding: 0 7.5px;
          vertical-align: top;
          display: inline-block;
        }
        .group-manage__block_list {
          width: 60%;
        }
        .group-manage__block_group {
          width: 40%;
        }
      `}</style>

    </DefaultLayout>
  )
}

const mapStateToProps = state => {}
const mapDispatchToProps = dispatch => {}

export default PageHoc(isLogged(GroupPage), {
  title: 'Управление группой',
  mapStateToProps,
  mapDispatchToProps
})

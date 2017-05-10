import Access from '../../../client/hocs/Access'
import Page from '../../../client/hocs/Page'
import Panel from '../../../client/components/Panel'
import SettingsLayout from '../../../client/layouts/settings'

const AccoutSettings = props => {
  return (
    <SettingsLayout {...props}>
      <Panel Footer={() => <button className='myBtn'>Сохранить</button>} Header={() => <h2>Основные настройки</h2>}>

        <form className='panel-form'>
          <div className='panel-form__row'>
            <label className='panel-form__label'>Label</label>
            <input className='panel-form__input' type='text' />
          </div>

          <div className='panel-form__row'>
            <label className='panel-form__label'>Label</label>
            <input className='panel-form__input' type='text' />
          </div>

          <div className='panel-form__row'>
            <label className='panel-form__label'>Label</label>
            <input className='panel-form__input' type='text' />
          </div>
        </form>

      </Panel>
    </SettingsLayout>
  )
}

const accessRule = (user, state) => true

export default Page(Access(accessRule)(AccoutSettings))

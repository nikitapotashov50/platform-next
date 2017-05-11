import { translate } from 'react-i18next'

import Access from '../../../client/hocs/Access'
import Page from '../../../client/hocs/Page'
import Panel from '../../../client/components/Panel'
import SettingsLayout from '../../../client/layouts/settings'

const AccoutSettings = ({ t, ...props}) => {
  return (
    <SettingsLayout {...props}>
      <Panel Footer={() => <button className='myBtn'>{t('common.save')}</button>} Header={() => <h2>{t('settings.main.title')}</h2>}>
        
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

let translated = translate([ 'common' ])(AccoutSettings)

export default Page(Access(accessRule)(translated))

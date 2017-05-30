import { translate } from 'react-i18next'

import Panel from '../../Panel'
import GoalSettings from '../../AccountSettings/Goal'

const GoalReply = ({ t }) => (
  <Panel Header={<div className='panel__title panel__title_small'>Поставьте точки А и Б</div>}>
    <GoalSettings data={{}} errors={{}} affected={{}} t={t} onChange={() => {}} />
  </Panel>
)

export default translate([ 'common' ])(GoalReply)

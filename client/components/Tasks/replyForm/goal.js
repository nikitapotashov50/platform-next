import { pick } from 'lodash'
import { translate } from 'react-i18next'

import GoalSettings from '../../AccountSettings/Goal'

const GoalReply = ({ t, onChange, data = {}, affected, errors }) => (
  <GoalSettings data={data} errors={errors} affected={affected} t={t} onChange={onChange} />
)

GoalReply.title = 'Поставьте точку А, Б и укажите нишу'

GoalReply.getData = specific => pick(specific, [ 'a', 'b', 'occupation' ])

GoalReply.validate = (data) => GoalSettings.validate(data)

export default translate([ 'common' ])(GoalReply)

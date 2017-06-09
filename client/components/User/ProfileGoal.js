import numeral from 'numeral'
import Panel from '../../elements/Panel'

const UserGoal = ({ goal }) => {
  let overwhelmed = false

  let progress = 100 - ((goal.b - goal.progress) / (goal.b / 100))
  if (progress > 100) {
    progress = 100
    overwhelmed = true
  }

  return (
    <Panel bodyStyles={{ noPadding: true }} Header={(
      <div className='user-side-panel'>
        <div className='user-side-panel__title'> Цель</div>
      </div>
    )}>
      <div className='profile-goal'>
        <div className={[ 'profile-goal__progress', overwhelmed ? 'profile-goal__progress_completed' : '' ].join(' ')} style={{ width: progress + '%' }} />
        <div className='profile-goal__block profile-goal__block_a'>{numeral(goal.a).format('0,0')} ₽</div>
        <div className='profile-goal__block profile-goal__block_b'>{numeral(goal.b).format('0,0')} ₽</div>
      </div>
    </Panel>
  )
}

export default UserGoal

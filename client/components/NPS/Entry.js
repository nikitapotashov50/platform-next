import Panel from '../Panel'
import RatingBar from '../Rating/Bar'
import UserInline from '../User/Inline'

export default ({ body, labels, User, ...props }) => {
  let Footer = (
    <div className='nps-result'>
      <div className='nps-result__row'>
        <div className='nps-result__row-title'>{labels['score_1']}</div>
        <RatingBar className='nps-result__row-value' rate={props.score_1} inline />
      </div>
      <div className='nps-result__row'>
        <div className='nps-result__row-title'>{labels['score_2']}</div>
        <RatingBar className='nps-result__row-value' rate={props.score_2} inline />
      </div>
      <div className='nps-result__row'>
        <div className='nps-result__row-title'>{labels['score_3']}</div>
        <RatingBar className='nps-result__row-value' rate={props.score_3} inline />
      </div>
    </div>
  )

  let headerStyles = {}
  if (!body) headerStyles.noBorder = true

  return (
    <Panel Footer={() => Footer} Header={<UserInline date={props.created_at} user={User} />} noBody={!body} headerStyles={headerStyles}>
      { body && (
        <div className='post-preview'>
          <a className='post-preview__body'>{body}</a>
        </div>
      )}
    </Panel>
  )
}

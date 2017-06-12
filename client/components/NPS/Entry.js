import Panel from '../../elements/Panel'
import RatingBar from '../Rating/Bar'
import UserInline from '../User/Inline'

export default ({ data, body, labels, User, ...props }) => {
  let Footer = (
    <div className='nps-result'>
      <div className='nps-result__row'>
        <div className='nps-result__row-title'>{labels['score_1']}</div>
        <RatingBar className='nps-result__row-value' rate={data.score[0]} inline />
      </div>
      <div className='nps-result__row'>
        <div className='nps-result__row-title'>{labels['score_2']}</div>
        <RatingBar className='nps-result__row-value' rate={data.score[1]} inline />
      </div>
      <div className='nps-result__row'>
        <div className='nps-result__row-title'>{labels['score_3']}</div>
        <RatingBar className='nps-result__row-value' rate={data.score[2]} inline />
      </div>
    </div>
  )
  console.log(data)

  let headerStyles = {}
  if (!data.content) headerStyles.noBorder = true

  return (
    <Panel Footer={() => Footer} Header={<UserInline date={data.created} user={User} />} noBody={!data.content} headerStyles={headerStyles}>
      { data.content && (
        <div className='post-preview'>
          <a className='post-preview__body'>{data.content}</a>
        </div>
      )}
    </Panel>
  )
}

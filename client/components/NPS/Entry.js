import Panel from '../../elements/Panel'
import RatingBar from '../Rating/Bar'
import UserInline from '../User/Inline'

export default ({ data, body, labels, User, ...props }) => {
  let Footer = (
    <div className='nps-result'>
      { (data.score || []).map((el, i) => (
        <div className='nps-result__row' key={`nps-score-${i}`}>
          <div className='nps-result__row-title'>{labels[`score_${i + 1}`]}</div>
          <RatingBar className='nps-result__row-value' rate={data.score[i]} inline />
        </div>
      ))}
    </div>
  )

  let headerStyles = {}
  if (!data.content) headerStyles.noBorder = true

  return (
    <Panel Footer={Footer} Header={<UserInline date={data.created} user={data.userId} />} noBody={!data.content} headerStyles={headerStyles}>
      { data.content && (
        <div className='post-preview'>
          <a className='post-preview__body'>{data.content}</a>
        </div>
      )}
    </Panel>
  )
}

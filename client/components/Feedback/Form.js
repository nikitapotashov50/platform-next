import Panel from '../../elements/Panel'
import PanelTitle from '../../elements/Panel/Title'
import RatingBar from '../Rating/Bar'
import OverlayLoader from '../OverlayLoader'

import Button from '../../elements/Button'

const changeContent = (next, e) => next('content', e.target.value.replace(/(<([^>]+)>)/ig, ''))
const changeScore = (num, next) => value => next(`score`, value, num)

const feedbackForm = ({ fetching, errors, data, type, t, onChange, onSubmit }) => {
  let Footer = <Button onClick={onSubmit.bind(this)} disabled={fetching}>Отправить отзыв</Button>

  return (
    <Panel Header={<PanelTitle title='Оставьте отзыв о платформе' />} Footer={Footer}>
      <OverlayLoader loading={fetching}>
        <div className='post-preview'>
          <textarea className='' value={data.content} onChange={changeContent.bind(this, onChange)} rows={7} placeholder={'Написать отзыв, минимум 15 символов'} />
          { errors.content && <span>{errors.content}</span>}
        </div>

        <br />

        <div className='nps-result'>
          { data.score.map((el, i) => (
            <div className='nps-result__row' key={`score-${i}`}>
              <div className='nps-result__row-title'>{t(`feedback.labels.${type}.score_${i + 1}`)}</div>
              <RatingBar className='nps-result__row-value' rate={el} inline noValues onChange={changeScore(i, onChange)} />
            </div>
          ))}
        </div>
      </OverlayLoader>
    </Panel>
  )
}

feedbackForm.validate = (data, errors = {}) => {
  if (!data.content) errors.content = 'Напишите текст отзыва'
  else if (data.content.length < 15) errors.content = 'Сообщение должно содержать минимум 15 симовлов'

  return errors
}

export default feedbackForm

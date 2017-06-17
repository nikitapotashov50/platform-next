import numeral from 'numeral'

const formatMoney = value => numeral(value || 0).format('0,0')

export default ({ data }) => (
  <div>
    <div className='post-preview__greetings_wrap'><strong className='post-preview__greetings_title'>Моя ниша:</strong> <p className='post-preview__greetings_body'>{data.occupation}</p></div>
    <div className='post-preview__greetings_wrap'><strong className='post-preview__greetings_title'>Ax10:</strong> <p className='post-preview__greetings_body'>{formatMoney(data.x10)} ₽</p></div>
    <div className='post-preview__greetings_wrap'><strong className='post-preview__greetings_title'>Моя мечта:</strong> <p className='post-preview__greetings_body'>{data.dream}</p></div>

    <div className='post-preview__greetings_wrap'><strong className='post-preview__greetings_title'>Моя точка А:</strong> <p className='post-preview__greetings_body'>{formatMoney(data.a)} ₽</p></div>
    <div className='post-preview__greetings_wrap'><strong className='post-preview__greetings_title'>Моя точка Б:</strong> <p className='post-preview__greetings_body'>{formatMoney(data.b)} ₽</p></div>
    <div className='post-preview__greetings_wrap'><strong className='post-preview__greetings_title'>Артефакт Б:</strong> <p className='post-preview__greetings_body'>{data.dream_artifact}</p></div>

    <div className='post-preview__greetings_wrap'><strong className='post-preview__greetings_title'>PxQ:</strong> <p className='post-preview__greetings_body'>{data.pq}</p></div>

    <div className='post-preview__greetings_wrap'><strong className='post-preview__greetings_title'>Деньги на неделю:</strong>
      <p className='post-preview__greetings_body'>{formatMoney(data.week_money)} ₽</p>
    </div>
    <div className='post-preview__greetings_wrap'><strong className='post-preview__greetings_title'>Действие на неделю</strong>
      <p className='post-preview__greetings_body'>{data.week_action}</p>
    </div>
  </div>
)

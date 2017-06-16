import numeral from 'numeral'

const formatMoney = value => numeral(value || 0).format('0,0')

export default ({ data }) => (
  <div>
    <div className='post-preview__greetings_wrap'><strong className='post-preview__greetings_title'>Моя ниша:</strong> <p className='post-preview__greetings_body'>{data.occupation}</p></div>
    <div className='post-preview__greetings_wrap'><strong className='post-preview__greetings_title'>Ax10:</strong> <p className='post-preview__greetings_body'>{formatMoney(data.x10)} ₽</p></div>
    <div className='post-preview__greetings_wrap'><strong className='post-preview__greetings_title'>Моя мечта:</strong> <p className='post-preview__greetings_body'>{data.dream}</p></div>

    <div className='post-preview__greetings_wrap'><strong className='post-preview__greetings_title'>Моя точка А:</strong> <p className='post-preview__greetings_body'>{formatMoney(data.a)} ₽</p></div>
    <div className='post-preview__greetings_wrap'><strong className='post-preview__greetings_title'>Моя точка Б:</strong> <p className='post-preview__greetings_body'>{formatMoney(data.b)} ₽</p></div>
    <div className='post-preview__greetings_wrap'><strong className='post-preview__greetings_title'>PxQ:</strong> {data.pq}</div>

    <div className='post-preview__greetings_wrap'><strong className='post-preview__greetings_title'>Пирожок:</strong>
      <p className='post-preview__greetings_body'>{data.pie}</p>
    </div>

    <div className='post-preview__greetings_wrap'><strong className='post-preview__greetings_title'>Что мне нужно?</strong>
      <p className='post-preview__greetings_body'>{data.need}</p>
    </div>
  </div>
)

import numeral from 'numeral'

const formatMoney = value => numeral(value || 0).format('0,0')

export default ({ data }) => (
  <div>
    <div className='post-preview__knife'><strong>Цель на неделю</strong> <p>{formatMoney(data.goal)} ₽</p></div>
    <div className='post-preview__greetings_wrap'><strong className='post-preview__greetings_title'>План действий</strong> <p className='post-preview__greetings_body'>{data.action}</p></div>
    <div className='post-preview__greetings_wrap'><strong className='post-preview__greetings_title'>Цена слова</strong> <p className='post-preview__greetings_body'>{data.price}</p></div>
  </div>
)

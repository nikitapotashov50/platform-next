import numeral from 'numeral'

const formatMoney = value => numeral(value || 0).format('0,0')

export default ({ data }) => (
  <div className='post-preview__ab'>
    <div className='post-preview__ab_a'><strong>Точка А</strong> <p>{formatMoney(data.a)} ₽</p></div>
    <div className='post-preview__ab_b'><strong>Точка Б</strong> <p>{formatMoney(data.b)} ₽</p></div>
  </div>
)

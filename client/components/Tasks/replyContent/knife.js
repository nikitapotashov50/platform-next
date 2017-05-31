import numeral from 'numeral'

const formatMoney = value => numeral(value || 0).format('0,0')

export default ({ data }) => (
  <div>
    <div><strong>Цель на две недели:</strong> {formatMoney(data.goal)} ₽</div>
    <div><strong>План действий</strong> {data.action}</div>
    <div><strong>Цена слова:</strong> {data.price}</div>
  </div>
)

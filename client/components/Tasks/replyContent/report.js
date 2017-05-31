import numeral from 'numeral'

const formatMoney = value => numeral(value || 0).format('0,0')

export default ({ data }) => (
  <div>
    <div><strong>Факт за неделю:</strong> {formatMoney(data.fact)} ₽</div>
    <div><strong>Ключевое действие</strong> {data.action}</div>
  </div>
)

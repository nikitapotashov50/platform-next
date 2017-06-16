import numeral from 'numeral'

const formatMoney = value => numeral(value || 0).format('0,0')

export default ({ data }) => (
  <div>
    <div><strong>Ниша:</strong> {data.occupation}</div>
    <div><strong>Ваша точка А, в рублях:</strong> {formatMoney(data.a)} ₽</div>
    <div><strong>Ваша точка Б на два месяца, в рублях:</strong> {formatMoney(data.b)} ₽</div>
  </div>
)

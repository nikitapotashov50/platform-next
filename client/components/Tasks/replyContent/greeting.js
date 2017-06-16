import numeral from 'numeral'

const formatMoney = value => numeral(value || 0).format('0,0')

export default ({ data }) => (
  <div>
    <h2>Привет, Цех!</h2>
    <div><strong>Моя ниша:</strong> {data.occupation}</div>
    <div><strong>Моя точка Бx10:</strong> {formatMoney(data.x10)} ₽</div>
    <div><strong>Моя мечта:</strong> {data.dream}</div>

    <div><strong>Моя точка А:</strong> {formatMoney(data.a)} ₽</div>
    <div><strong>Моя точка Б:</strong> {formatMoney(data.b)} ₽</div>
    <div><strong>Декомпозиция точки Б:</strong> {data.pq}</div>

    <div><strong>Пирожок:</strong>
      <p>{data.pie}</p>
    </div>

    <div><strong>Что мне нужно и как ты можешь помочь мне?</strong>
      <p>{data.need}</p>
    </div>
  </div>
)

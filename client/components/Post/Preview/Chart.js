import { ResponsiveContainer, LineChart, Line } from 'recharts'

export default ({ data }) => (
  <div style={{ overflowX: 'hidden' }}>
    <ResponsiveContainer width={510} height={40}>
      <LineChart data={data.map(el => ({ value: el }))}>
        <Line type='monotone' stroke='#f5be00' dataKey='value' name='Оценка' />
      </LineChart>
    </ResponsiveContainer>
  </div>
)

import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts'

export default ({ data }) => (
  <div style={{ overflowX: 'hidden' }}>
    <ResponsiveContainer width={510} height={75}>
      <LineChart data={data.map(el => ({ value: el }))}>
        <Tooltip />
        <Line type='monotone' stroke='#f5be00' dataKey='value' name='Оценка' />
      </LineChart>
    </ResponsiveContainer>
  </div>
)

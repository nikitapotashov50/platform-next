import { LineChart, Line, Tooltip } from 'recharts'
// XAxis

export default ({ data }) => {
  return (
    <div>
      <br />
      <LineChart width={340} height={200} data={data}>
        {/* <XAxis dataKey='date' /> / */}
        <Tooltip />

        <Line type='monotone' dataKey='score_1' stroke='#8884d8' name='Контент' />
        <Line type='monotone' dataKey='score_2' stroke='#f5be00' name='Эмоции"' />
        <Line type='monotone' dataKey='score_3' stroke='#ff7300' name='Организация' />
        <Line type='monotone' dataKey='total' stroke='#82ca9d' name='Общий' />
      </LineChart>
    </div>
  )
}
// google browser

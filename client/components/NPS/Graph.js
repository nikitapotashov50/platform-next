import { LineChart, Line, XAxis, Tooltip } from 'recharts'
// XAxis

const formatter = item => item.toFixed(2)

export default ({ data, t }) => {
  return (
    <div>
      <br />
      <LineChart width={340} height={200} data={data}>
        <XAxis dataKey='date' />
        <Tooltip />

        <Line type='monotone' dataKey='score_1' stroke='#8884d8' name={t('score_1')} formatter={formatter} />
        <Line type='monotone' dataKey='score_2' stroke='#f5be00' name={t('score_2')} formatter={formatter} />
        <Line type='monotone' dataKey='score_3' stroke='#ff7300' name={t('score_3')} formatter={formatter} />
        <Line type='monotone' dataKey='total' stroke='#82ca9d' name={t('total')} formatter={formatter} />
      </LineChart>
    </div>
  )
}
// google browser

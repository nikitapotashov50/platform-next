import TimeAgo from 'react-timeago'
import ruStrings from 'react-timeago/lib/language-strings/ru'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'

const formatter = buildFormatter(ruStrings)

export default (props) => (
  <TimeAgo formatter={formatter} live {...props} />
)

import CurrentList from './Current'
import DefaultList from './Default'

export default {
  current: CurrentList,
  rejected: DefaultList('rejected'),
  approved: DefaultList('approved'),
  pending: DefaultList('pending')
}

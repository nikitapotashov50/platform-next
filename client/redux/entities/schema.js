import { schema } from 'normalizr'

const user = new schema.Entity('users', {}, { idAttribute: '_id' })
const city = new schema.Entity('cities', {}, { idAttribute: '_id' })

export const nps = new schema.Entity('nps', { userId: user, cityId: city }, { idAttribute: '_id' })
export const npsList = [ nps ]

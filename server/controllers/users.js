const { models } = require('../models')

const getUserWithOccupation = (id) => {

}

const getUserGroups = (id, limit = null) => {
  let query = {
    where: {
      '$Users.id$': id
    },
    attributes: [ 'id', 'title' ],
    include: [
      {
        duplicating: false,
        required: true,
        as: 'Users',
        model: models.User,
        attributes: [],
        through: {
          attributes: []
        }
      }
    ]
  }

  if (limit) query.limit = limit

  return models.Group.findAndCountAll(query)
}

const getUserSubscribers = (id, limit = 6, type = 'Subscribers') => {
  let query = {
    where: {
      ['$' + type + '.id$']: id
    },
    attributes: [ 'id', 'first_name', 'last_name', 'name', 'picture_small' ],
    include: [
      {
        duplicating: false,
        required: true,
        as: type,
        model: models.User,
        attributes: [],
        through: {
          attributes: []
        }
      }
    ]
  }

  if (limit) query.limit = limit

  return models.User.findAndCountAll(query)
}

module.exports = {
  getUserGroups,
  getUserSubscribers,
  getUserWithOccupation
}

'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'users',
        'radar_access_token',
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        'users',
        'radar_id',
        Sequelize.STRING
      )
    ])
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('users', 'radar_access_token'),
      queryInterface.removeColumn('users', 'radar_id')
    ])
  }
}

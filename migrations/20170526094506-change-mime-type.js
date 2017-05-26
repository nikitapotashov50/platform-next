'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'attachments',
      'mime',
      {
        type: Sequelize.STRING
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'attachments',
      'mime',
      {
        type: Sequelize.JSON
      }
    )
  }
}

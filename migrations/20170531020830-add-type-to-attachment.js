'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'attachments',
      'type',
      {
        type: Sequelize.ENUM('image', 'document', 'video'),
        defaultValue: 'image'
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('attachments', 'type')
  }
}

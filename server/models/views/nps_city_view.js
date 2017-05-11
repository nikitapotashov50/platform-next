module.exports = (sequelize, DataTypes) => {
  const NPSCityView = sequelize.define(
    'NPSCityView',
    {
      id: {
        type: DataTypes.INTEGER
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      city_id: {
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      program_id: {
        type: DataTypes.INTEGER
      },
      city_name: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'nps_by_city_view',
      classMethods: {
        associate: (models) => {          
          // NPSCityView.belongsToMany(models.ProgramClass, { through: 'nps_classes', foreignKey: 'nps_id' })
          NPSCityView.belongsTo(models.Program, { foreignKey: 'program_id' })
          NPSCityView.belongsTo(models.User, { foreignKey: 'user_id' })
          NPSCityView.belongsTo(models.City, { foreignKey: 'city_id' })
          NPSCityView.belongsTo(models.NPS, { foreignKey: 'id' })
        }
      }
    }
  )

  return NPSCityView
}

module.exports = (sequelize, DataTypes) => {
  /*
    NPS по платформе.
    Вынесена в отдельную модель чтобы не засорять основную модель NPS
  */
  const NPSPlatform = sequelize.define(
    'NPSPlatform',
    {
      nps_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        referennces: {
          model: 'nps',
          field: 'id'
        }
      }
    },
    {
      tableName: 'nps_platform',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true,
      classMethods: {
        associate: (models) => {
          // указание на родительский нпс
          NPSPlatform.belongsTo(models.NPS, { foreignKey: 'nps_id' })
        }
      }
    }
  )

  return NPSPlatform
}

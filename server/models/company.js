module.exports = (sequelize, DataTypes) => {
  /*
    Модель описывает компанию
  */
  const Company = sequelize.define(
    'Company',
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      occupation: {
        type: DataTypes.TEXT
      },
      website: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'companies',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true,
      classMethods: {
        associate: (models) => {
          // У компании есть создатель
          Company.belongsTo(models.User, { foreign_key: 'user_id' })

          // К компании относится много целей
          Company.hasMany(models.Goal, { foreign_key: 'company_id' })
        }
      }
    }
  )

  return Company
}

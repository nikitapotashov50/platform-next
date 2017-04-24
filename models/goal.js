module.exports = (sequelize, DataTypes) => {

	const Goal = sequelize.define(
    'Goal',
    {
      a: {
        allowNull: false,
        type: DataTypes.BIGINT
      },
      b: {
        allowNull: false,
        type: DataTypes.BIGINT
      },
      fact: {
        type: DataTypes.BIGINT
      },
      confirmed: {
        type: DataTypes.BIGINT
      },
      fine: {
        type: DataTypes.BIGINT,
      },
      is_closed: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN
      },
      start_at: {
        type: DataTypes.DATE
      },
      finish_at: {
        type: DataTypes.DATE
      },
      occupation: {
        type: DataTypes.TEXT
      }
    },
    {
      tableName: 'goals',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true,
      classMethods: {
        associate: (models) => {
          // Цель приналежит пользователю
          Goal.belongsTo(models.User, { foreignKey: 'user_id' })

          // Цель может реализовываться в рамках программы
          Goal.belongsTo(models.Program, {
            foreignKey: {
              allowNull: true,
              field: 'program_id'
            }
          })

          // У цели есть доход
          Goal.hasMany(models.Income, { foreignKey: 'goal_id' })
        }
      }
    }
  )
  
  return Goal
}
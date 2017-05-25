module.exports = (sequelize, DataTypes) => {
  /*
    Модель описывает поведение тренерских групп.
    Пока что модель не содержить уникальных полей, но это сделано для будущего расширения (на всякий случай)
  */
  const CoachGroup = sequelize.define(
    'CoachGroup',
    {
      group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        referennces: {
          model: 'group',
          field: 'id'
        }
      },
      subleader_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      tableName: 'groups_coach',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true,
      classMethods: {
        associate: (models) => {
          // Группы привязана к родительской записи - к самой группе
          CoachGroup.belongsTo(models.Group, { foreignKey: { field: 'group_id', primaryKey: true, allowNull: false } })

                    // у группы есть лидер
          CoachGroup.belongsTo(models.User, { foreignKey: 'subleader_id', as: 'Subleader' })
        }
      }
    }
  )

  return CoachGroup
}

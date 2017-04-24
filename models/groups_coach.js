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
        }
      }
    }
  )

  return CoachGroup
}
module.exports = (sequelize, DataTypes) => {
  /*
    Модель описывает поведение иерархических групп в программах ЦЕХ и МЗС.
    group_id указывает на группу в модели Group
  */
  const GameGroup = sequelize.define(
    'GameGroup',
    {
      // group_id указывает на группу в модели Group
      group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        referennces: {
          model: 'group',
          field: 'id'
        }
      },
      // тип группы - десятка, группа, полк. Может быть дополнено в будущем.
      type: {
        allowNull: false,
        defaultValue: 'ten',
        type: DataTypes.ENUM([ 'polk', 'hundred', 'ten' ])
      }
    },
    {
      tableName: 'groups_game',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true,
      classMethods: {
        associate: (models) => {
          // Группы привязана к родительской записи - к самой группе
          GameGroup.belongsTo(models.Group, { foreignKey: { field: 'group_id', primaryKey: true, allowNull: false } })

          // Ассоциация для построения структуры предков
          GameGroup.belongsTo(GameGroup, { foreignKey: 'parent_id', as: 'ParentGroup' })
          
          // Ассоциация для построения структуры потомков
          GameGroup.hasMany(GameGroup, { foreignKey: 'parent_id', as: 'ChildGroups' })
        }
      }
    }
  )

  return GameGroup
}
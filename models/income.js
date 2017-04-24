module.exports = (sequelize, DataTypes) => {
  /*
    Модель описывает сущность "Доход".
    Пока что было оговорено, что фактический доход пользователей будет учитываться по сумме дохода в ответ на задания.
  */
  const Income = sequelize.define(
    'Income',
    {
      // сумма дохода
      amount: {
        allowNull: false,
        type: DataTypes.BIGINT
      },
      // флаг подтверждения дохода
      is_confirmed: {
        type: DataTypes.BOOLEAN
      }
    },
    {
      tableName: 'incomes_view',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true,
      classMethods: {
        associate: (models) => {
          // Доход относится к пользователю]
          Income.belongsTo(models.User, { foreignKey: 'user_id' })

          // Доход относится к цели
          Income.belongsTo(models.Goal, { foreignKey: 'goal_id' })

          // Доход привязывается к ответу на задание
          Income.belongsTo(models.TaskReply, { foreignKey: 'task_reply_id' })
        }
      }
    }
  )

  return Income
}

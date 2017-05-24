module.exports = (sequelize, DataTypes) => {
  /**
   * Модель задания.
   * Модель описывает прототипные (типовые) задания. Конкретные задания (которые видны пользователям и на которые они могут ответиь), описаны в модели TaskEntry
   */
  const TaskReply = sequelize.define(
    'TaskReply',
    {
    },
    {
      tableName: 'task_replies',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
      classMethods: {
        associate: (models) => {
          // ответ отправляет пользователь
          TaskReply.belongsTo(models.User, { foreignKey: 'user_id' })

          //
          // TaskReply.belongsTo(models.User, { foreignKey: 'user_id' })
        }
      }
    }
  )

  return TaskReply
}

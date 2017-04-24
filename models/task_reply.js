module.exports = function (sequelize, DataTypes) {
  /**
   * Модель описывает ответы на задание.
   * Сссылается на пост пользователя (который содержит непосредственный ответ на задание)
   * К ответу на задание может быть привязана запись о доходе (Income)
   * Ответ на задание относится к записи задания
   */
  var TaskReply = sequelize.define(
    'TaskReply', 
    {}, 
    {
      tableName: 'tasks_replies',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true,
      classMethods: {
        associate: (models) => {
          // ответ на задание привязан к посту
          TaskReply.hasOne(models.UserPost, { foreignKey: 'task_reply_id' })

          // ответ оносится к заданию
          TaskReply.belongsTo(models.TaskEntry, { foreignKey: 'task_entry_id' })

          // Количество денег, заработанных на задании
          TaskReply.hasOne(models.Income, { foreignKey: 'task_reply_id' })
        }
      }
    }
  )
  
  return TaskReply
}

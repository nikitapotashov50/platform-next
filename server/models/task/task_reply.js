module.exports = (sequelize, DataTypes) => {
  /**
   * Модель задания.
   * Модель описывает прототипные (типовые) задания. Конкретные задания (которые видны пользователям и на которые они могут ответиь), описаны в модели TaskEntry
   */
<<<<<<< HEAD
  const TaskReply = sequelize.define(
    'TaskReply',
    {
    },
    {
      tableName: 'task_replies',
=======
  const Task = sequelize.define(
    'Task',
    {
      /**
       * Название
       */
      title: {
        type: DataTypes.STRING
      },
      /**
       * Содержание
       */
      content: {
        type: DataTypes.TEXT
      },
      /**
       * Если false - не отображается в списке типовых заданий, которые можно поставить пользователям
       */
      is_enabled: {
        defaultValue: true,
        type: DataTypes.BOOLEAN
      }
    },
    {
      tableName: 'tasks',
>>>>>>> tasks refactor
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
      classMethods: {
        associate: (models) => {
<<<<<<< HEAD
          // ответ отправляет пользователь
          TaskReply.belongsTo(models.User, { foreignKey: 'user_id' })

          //
          // TaskReply.belongsTo(models.User, { foreignKey: 'user_id' })
=======
          // задание имеет много тегов
          Task.belongsToMany(models.Tag, { foreignKey: 'task_id', as: 'Tags', through: 'tags_tasks' })

          // Задание могут много раз назначить пользователям
          Task.hasMany(models.TaskEntry, { foreignKey: 'task_id' })
>>>>>>> tasks refactor
        }
      }
    }
  )

<<<<<<< HEAD
  return TaskReply
=======
  return Task
>>>>>>> tasks refactor
}

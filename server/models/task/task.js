module.exports = (sequelize, DataTypes) => {
  /**
   * Модель задания.
   * Модель описывает прототипные (типовые) задания. Конкретные задания (которые видны пользователям и на которые они могут ответиь), описаны в модели TaskEntry
   */
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
       * Время и дата начала
       */
      start_at: {
        type: DataTypes.DATE
      },
      /**
       * Время и дата окончания
       */
      finish_at: {
        type: DataTypes.DATE
      },
      /**
       * Если false - не отображается в списке заданий
       */
      is_enabled: {
        defaultValue: true,
        type: DataTypes.BOOLEAN
      }
    },
    {
      tableName: 'tasks',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
      classMethods: {
        associate: (models) => {
          // Задание может быть плданом кинжалом
          Task.hasOne(models.KnifeTask, { foreignKey: 'task_id' })

          // Может быть постевлено пользователям
          Task.belongsToMany(models.User, { as: 'TargetUsers', foreignKey: 'task_id', through: 'tasks_users' })

          // Может быть постевлено программам
          Task.belongsToMany(models.Program, { as: 'TargetPrograms', foreignKey: 'task_id', through: 'tasks_programs' })

          // Может быть постевлено группам
          Task.belongsToMany(models.Group, { as: 'TargetGroups', foreignKey: 'task_id', through: 'tasks_groups' })

          // Имеет автора
          Task.belongsTo(models.User, { foreignKey: 'user_id' })

          // задание имеет много тегов
          // Task.belongsToMany(models.Tag, { foreignKey: 'task_id', as: 'Tags', through: 'tags_tasks' })

          // Задание могут много раз назначить пользователям
          // Task.hasMany(models.TaskEntry, { foreignKey: 'task_id' })
        }
      }
    }
  )

  return Task
}

module.exports = (sequelize, DataTypes) => {
  /**
   * Модель задания.
   * Модель описывает прототипные (типовые) задания. Конкретные задания (которые видны пользователям и на которые они могут ответиь), описаны в модели TaskEntry
   */
  const TaskPrototype = sequelize.define(
    'TaskPrototype',
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
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
      classMethods: {
        associate: (models) => {
          // задание имеет много тегов
          // TaskPrototype.belongsToMany(models.Tag, { foreignKey: 'task_id', as: 'Tags', through: 'tags_tasks' })

          // Задание могут много раз назначить пользователям
          // TaskPrototype.hasMany(models.Task, { foreignKey: 'task_id' })
        }
      }
    }
  )

  return TaskPrototype
}

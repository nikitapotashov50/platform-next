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
        defaultValue: '',
        type: DataTypes.STRING
      },
      /**
       * Содержание
       */
      content: {
        defaultValue: '',
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
      tableName: 'task_prototypes',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
      classMethods: {
        associate: (models) => {
          // Прототип имеет множество применений в конкретных заданиях
          TaskPrototype.hasMany(models.Task, { foreignKey: 'task_prototype_id' })
        }
      }
    }
  )

  return TaskPrototype
}

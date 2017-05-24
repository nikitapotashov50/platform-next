module.exports = (sequelize, DataTypes) => {
  /**
   * Модель задания.
   * Модель описывает прототипные (типовые) задания. Конкретные задания (которые видны пользователям и на которые они могут ответиь), описаны в модели TaskEntry
   */
  const KnifeTask = sequelize.define(
    'KnifeTask',
    {
<<<<<<< HEAD
      price: {
        type: DataTypes.BIGINT
      }
=======
>>>>>>> tasks refactor
    },
    {
      tableName: 'tasks',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
      classMethods: {
        associate: (models) => {
          //
          KnifeTask.belongsTo(models.Task, { foreignKey: 'task_id' })
        }
      }
    }
  )

  return KnifeTask
}

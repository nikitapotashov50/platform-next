module.exports = function (sequelize, DataTypes) {
  /**
   * Модель, описывающая статус проверки ответа на задание.
   * С помощью этой модели можно привязывать ответы на задания к определенным "проверяющим" волонтерам и т.д.
   */
  var TaskVerify = sequelize.define(
    'TaskVerify', 
    {
      /**
       * статус проверки
       */
      status: {
        defaultValue: 'assigned', 
        type: DataTypes.ENUM([ 'assigned', 'pending', 'approved', 'rejected' ])
      }
    }, 
    {
      tableName: 'tasks_verifications',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true,
      classMethods: {
        associate: (models) => {
          // Проверка прицепляется к человеку
          TaskVerify.belongsTo(models.User, { foreignKey: 'user_id', as: 'Supervisor' })

          // проверка относится к ответу на задание
          TaskVerify.belongsTo(models.TaskReply, { foreignKey: 'task_reply_id' })
        }
      }
    }
  )
  
  return TaskVerify
}

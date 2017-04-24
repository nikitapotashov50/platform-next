module.exports = (sequelize, DataTypes) => {
  /*
    Модель описывает сбор данных NPS
  */
  const NPS = sequelize.define(
    'NPS',
    {
      total: {
        type: DataTypes.DOUBLE
      },
      score_1: {
        type: DataTypes.INTEGER
      },
      score_2: {
        type: DataTypes.INTEGER
      },
      score_3: {
        type: DataTypes.INTEGER
      },
      // тело отзыва
      body: {
        type: DataTypes.TEXT
      },
      // id для миграции, потом можно будет это поле убрать
      migration_id: {
        type: DataTypes.INTEGER
      }
    },
    {
      tableName: 'nps',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true,
      classMethods: {
        associate: (models) => {
          // Запись рейтинга была оставлена пользователем
          NPS.belongsTo(models.User, { foreignKey: 'user_id' })

          // Запись рейтинга может быть привязана к пользователю
          NPS.belongsToMany(models.User, { through: 'nps_users', foreignKey: 'nps_id', as: 'UserNps' })

          // Запись рейтинга может быть привязана к посту
          NPS.belongsToMany(models.Post, { through: 'nps_posts', foreignKey: 'nps_id', as: 'PostNps' })

          // Запись рейтинга может быть привязана к занятию программы
          NPS.belongsToMany(models.ProgramClass, { through: 'nps_classes', foreignKey: 'nps_id', as: 'ProgramClassNps' })

          // Запись рейтинга может быть привязана к занятию программы
          NPS.belongsToMany(models.Program, { through: 'nps_program', foreignKey: 'nps_id', as: 'ProgramNps' })

          // Запись рейтинга может быть привязана к занятию программы
          NPS.belongsToMany(models.Group, { through: 'nps_group', foreignKey: 'nps_id', as: 'GroupNps' })

          // так же есть NPS по платформе
          NPS.hasMany(models.NPSPlatform, { foreignKey: 'nps_id', as: 'PlatformNps' })
        }
      }
    }
  )

  return NPS
}
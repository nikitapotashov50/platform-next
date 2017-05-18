module.exports = (sequelize, DataTypes) => {
  /*
    Модель описывает пользователя системы
  */
  const SteemUser = sequelize.define(
    'SteemUser',
    {
      name: {
        type: DataTypes.STRING
      },
      uid: {
        type: DataTypes.INTEGER
      },
      data: {
        type: DataTypes.JSON
      }
    },
    {
      tableName: 'u_steem_users',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true
    }
  )

  return SteemUser
}

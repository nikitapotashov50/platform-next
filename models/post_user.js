module.exports = (sequelize, DataTypes) => {
  /* 
    Модель описывает посты пользователя.
    Пост пользователя может быть ответом на задание
    По таким постам будет считаться доход пользователя
  */
  const UserPost = sequelize.define(
    'UserPost',
    {
      // указание на родительский пост, является первичным ключом
      post_id: {
        primaryKey: true,
        field: 'post_id',
        type: DataTypes.INTEGER,
        references: { model: 'posts', key: 'id' }
      }
    },
    {
      tableName: 'posts_user',
      underscored: true,
      classMethods: {
        associate: (models) => {
          // Указывает на родительский пост
          UserPost.belongsTo(models.Post, { foreignKey: 'post_id' })

          // Пост может быть ответом на задание через модель TaskReply
          UserPost.belongsTo(models.TaskReply, { foreignKey: 'task_reply_id', as: 'ReplyTo' })
        }
      }
    }
  )

  return UserPost
}
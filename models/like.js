module.exports = (sequelize, DataTypes) => {
  /*  
    Модель описывает ссистему лайков.
    Пока что лайки ставязтся только к комментариям и к постам.
  */  
  const Like = sequelize.define(
    'Like',
    {},
    {
      tableName: 'likes',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true,
      classMethods: {
        associate: (models) => {
          // Лайк ставится пользователем
          Like.belongsTo(models.User, { foreignKey: 'user_id' })

          // Лайк ставится посту
          Like.belongsToMany(models.Post, { foreignKey: 'like_id', as: 'Posts', through: 'likes_posts' })

          // либо коментарию
          Like.belongsToMany(models.Comment, { foreignKey: 'like_id', as: 'Comments', through: 'likes_comments' })
        }
      }
    }
  )

  return Like
}
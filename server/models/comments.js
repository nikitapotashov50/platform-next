module.exports = (sequelize, DataTypes) => {
  /*
    КМодель комментариев.
    Пока что подразумевается, что комментарии могут быть оставлены только постам.
    parent_id указывает на «родительский» комметарий
  */
  const Comment = sequelize.define(
    'Comment',
    {
      content: {
        type: DataTypes.TEXT
      },
      /*
        Указывает на удаление комментария.
        При true дочерние элементы комментарии скрываются
      */
      is_blocked: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
      },
      /*
        Скрытый комментарий или нет
      */
      is_visible: {
        defaultValue: true,
        type: DataTypes.BOOLEAN
      }
    },
    {
      tableName: 'comments_view',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true,
      classMethods: {
        associate: (models) => {
          // todo узнать только ли к постам могут оставляться комментарии
          // комментарий может принадлежать посту
          Comment.belongsTo(models.Post, { foreignKey: 'post_id' })

          // Комментарий оставляется пользователем
          Comment.belongsTo(models.User, { foreignKey: 'user_id' })

          // Комментарий может являться дочерним комментарием
          Comment.belongsTo(Comment, { foreignKey: 'parent_id' })

          // Комментарий может иметь множество дочерних коментариев
          Comment.hasMany(Comment, { foreignKey: 'parent_id' })

          // Комментарий может иметь много лайков
          Comment.belongsToMany(models.Like, { foreignKey: 'comment_id', as: 'Likes', through: 'likes_comments' })
        }
      }
    }
  )

  return Comment
}

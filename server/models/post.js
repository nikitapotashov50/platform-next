module.exports = (sequelize, DataTypes) => {
  /*
    Модель описывает посты.
    Пока что описаны базовые поля поста. Потом будет расширять.

    У поста есть два типа
      1. user - пост пользователя.
      2. content - платные материалы

    Пост может принадлежать нескольким программам сразу.
    Посты без программы показываются всем пользователям, независимо от программ, в которых они участвуют.
  */
  const Post = sequelize.define(
    'Post',
    {
      title: {
        type: DataTypes.STRING
      },
      content: {
        type: DataTypes.TEXT
      },
      // флаг блокировки. Вместо удаления записи - блокировать. Так созранится целостность и статистика
      is_blocked: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
      },
      is_visible: {
        defaultValue: true,
        type: DataTypes.BOOLEAN
      },
      type: {
        allowNull: false,
        defaultValue: 'user',
        type: DataTypes.ENUM([ 'content', 'user' ])
      },
      views: {
        defaultValue: 0,
        type: DataTypes.INTEGER
      }
    },
    {
      tableName: 'posts',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true,
      classMethods: {
        associate: (models) => {
          // Пост отправлаяется пользователем
          Post.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })

          // у поста может быть множество тегов
          Post.belongsToMany(models.Tag, { foreignKey: 'post_id', as: 'Tags', through: 'tags_posts' })

          // у поста может быть множество лайков
          Post.belongsToMany(models.Like, { foreignKey: 'post_id', as: 'Likes', through: 'likes_posts' })

          // у поста может быть множество комментариев
          Post.hasMany(models.Comment, { foreignKey: 'post_id', as: 'comments' })

          // Множество постов могут принадлежать к множеству программ
          Post.belongsToMany(models.Program, { through: 'programs_posts', foreignKey: 'post_id' })

          // Посту может быть выставлена куча оценок
          Post.belongsToMany(models.NPS, { through: 'nps_posts', foreignKey: 'post_id', as: 'Nps' })

          // пост может быть постом пользователя
          // Post.hasOne(models.UserPost, { foreignKey: 'post_id' })

          // либо пост может быть постом с материалоами
          // Post.hasOne(models.ContentPost, { foreignKey: 'post_id' })
        }
      }
    }
  )

  return Post
}

module.exports = (sequelize, DataTypes) => {
  /*
    Посты с материалами.
    Надо прикрепить к ним планы подписки и прочее.
  */
  const ContentPost = sequelize.define(
    'ContentPost',
    {
      // указание на родительский пост, является первичным ключом
      post_id: {
        primaryKey: true,
        field: 'post_id',
        type: DataTypes.INTEGER,
        references: { model: 'posts', key: 'id' }
      },
      price: {
        defaultValue: 0,
        type: DataTypes.INTEGER
      },
      cover: {
        type: DataTypes.STRING
      },
      file: {
        type: DataTypes.STRING
      },
      video: {
        type: DataTypes.STRING
      },
      type: {
        type: DataTypes.ENUM(['presentation', 'video'])
      },
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      free: {
        defaultValue: 0,
        type: DataTypes.ENUM([0, 1])
      }
    },
    {
      tableName: 'posts_content',
      underscored: true,
      classMethods: {
        associate: (models) => {
          // указание на родительский пост, является первичным ключом
          ContentPost.belongsTo(models.Post, { foreignKey: 'post_id' })
        }
      }
    }
  )

  return ContentPost
}

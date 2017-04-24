module.exports = (sequelize, DataTypes) => {
  /**
   * Модель тегов. Выделена в отдельную таблицу, чтобы иметь возможность одни и те же теги привязывать к разным моделям и сущностям.
   */
  const Tag = sequelize.define(
    'Tag',
    {
      /**
       * Имя тега
       */
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      /**
       * Флаг активности. Если false, то можно, например, скрывать все такие теги из всех сущностей, к которым они привязаны
       */
      is_enabled: {
        defaultValue: true,
        type: DataTypes.BOOLEAN
      }
    },
    {
      tableName: 'tags',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
      classMethods: {
        associate: (models) => {
          // Тегом можно пометить пост
          Tag.belongsToMany(models.Post, { foreignKey: 'tag_id', as: 'Posts', through: 'tags_posts' })

          // Тегом можно пометить задание
          Tag.belongsToMany(models.Task, { foreignKey: 'tag_id', as: 'Tasks', through: 'tags_tasks' })
        }
      }
    }
  )

  return Tag
}

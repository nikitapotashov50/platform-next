export default (sequelize, DataTypes) => {
  /*
    Модель описывает прикрепленные к чему-либо файлы
  */
  const Attachment = sequelize.define(
    'Attachment',
    {
      name: {
        type: DataTypes.STRING
      },
      path: {
        type: DataTypes.STRING
      },
      mime: {
        type: DataTypes.JSON
      }
    },
    {
      tableName: 'attachments',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true,
      classMethods: {
        associate: (models) => {
          // Можно привязать к посту
          Attachment.belongsToMany(models.Post, { through: 'attachments_posts', foreign_key: 'attachment_id' })
        }
      }
    }
  )

  return Attachment
}

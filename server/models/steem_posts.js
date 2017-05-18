module.exports = (sequelize, DataTypes) => {
  /*
    Модель описывает пользователя системы
  */
  const SteemPost = sequelize.define(
    'SteemPost',
    {
      uid: {
        type: DataTypes.INTEGER
      },
      title: {
        type: DataTypes.STRING
      },
      body: {
        type: DataTypes.TEXT
      },
      author: {
        type: DataTypes.STRING
      },
      created: {
        type: DataTypes.DATE
      },
      updated: {
        type: DataTypes.DATE
      },
      permlink: {
        type: DataTypes.STRING
      },
      meta: {
        type: DataTypes.JSON
      },
      money: {
        type: DataTypes.STRING
      },
      tags: {
        type: DataTypes.JSON
      },
      isTaskReply: {
        type: DataTypes.JSON
      },
      isMzs: {
        type: DataTypes.STRING
      },
      reblogged_by: {
        type: DataTypes.JSON
      },
      replies: {
        type: DataTypes.JSON
      },
      active_votes: {
        type: DataTypes.JSON
      },
      parent_permlink: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'u_steem_posts',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true,
      charset: 'utf8mb4'
    }
  )

  return SteemPost
}

module.exports = (sequelize, DataTypes) => {
  /*
    Модель описывает группировку пользователей.
    Группы пользователей может принадлежать к одной программе.

    Есть три типа групп. Тип группы указывается в type:
      1. null – обычная группа пользователей.
      2. game - иерархические группы (десятки-сотни-полки)
      3. coach - тренерские группы
  */
  const Group = sequelize.define(
    'Group',
    {
      // название группы
      title: {
        type: DataTypes.STRING
      },
      // флаг блокировки. Устанавливается вместо фактического удаления группы, чтобы не нарушать целостность базы данных и собирать стсатистику
      is_blocked: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
      },
      // кол-во денег, заработаных в группе
      money: {
        defaultValue: 0,
        type: DataTypes.BIGINT
      },
      // рейтинг. Ну знаю, нужно будет или нет
      total_score: {
        type: DataTypes.DOUBLE
      },
      // id при миграции. Временное поле, потом можно будет убрать.
      migration_id: {
        unique: true,
        type: DataTypes.INTEGER
      },
      // тип группы
      type: {
        defaultvalue: null,
        type: DataTypes.ENUM([ 'game', 'coach' ])
      }
    },
    {
      tableName: 'groups',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true,
      classMethods: {
        associate: (models) => {
          // В группе есть много людей
          Group.belongsToMany(models.User, { through: 'users_groups', foreignKey: 'group_id', as: 'Users' })
          
          // у группы есть лидер
          Group.belongsTo(models.User, { foreignKey: 'leader_id', as: 'Leader' })

          // группа может принадлежать программе, может принадлежать сразу нескольким программам
          Group.belongsToMany(models.Program, { foreignKey: 'group_id', as: 'Programs', through: 'programs_groups' })

          // у группы может быть рейтинг
          Group.belongsToMany(models.NPS, { through: 'nps_group', foreignKey: 'group_id', as: 'Nps' })
        }
      }
    }
  )

  return Group
}
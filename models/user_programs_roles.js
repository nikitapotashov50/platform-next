module.exports = (sequelize, DataTypes) => {
  /*
    Модель описывает принадлежность пользователя к определенной роли внутри программы.
    Например, человек может проходить МЗС как обычный студент, и в то же время быть тренером в ЦЕХу
  */
  const UserProgramRole = sequelize.define(
    'UserProgramRole',
    {
      /* Флаг указывает на актуальность роли в программе для пользователя. */
      is_enabled: {
        defaultValue: true,
        type: DataTypes.BOOLEAN
      }
    },
    {
      tableName: 'users_programs_roles',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true,
      classMethods: {
        associate: (models) => {
          // запись принадлежит программе
          UserProgramRole.belongsTo(models.Program, { foreignKey: 'program_id' })

         // запись принадлежит пользователю
          UserProgramRole.belongsTo(models.User, { foreignKey: 'user_id' })

         // запись приналежит роли
          UserProgramRole.belongsTo(models.ProgramRole, { foreignKey: 'program_role_id' })
        }
      }
    }
  )

  return UserProgramRole
}

module.exports = (sequelize, DataTypes) => {
  /*

    Модель ролей в программах МЗС, ЦЕХ и т.д.
    Например Тренер, Волонтер, Студент и т.д.

  */
	const ProgramRole = sequelize.define(
    'ProgramRole', 
    {
      // имя роли. Кириллицей, но, наверное, надо будет сделать еще и alias
      name: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING
      },
      // флаг активности
      is_enabled: {
        defaultValue: true,
        type: DataTypes.BOOLEAN
      }
    },
    {
      tableName: 'program_roles',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true,
      classMethods: {
        associate: (models) => {
          // Каждую роль может иметь много пользователей
          ProgramRole.hasMany(models.UserProgramRole, { foreignKey: 'program_role_id' })
        }
      }
    }
  )

  return ProgramRole
}

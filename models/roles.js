module.exports = (sequelize, DataTypes) => {
  /*

    Глобальные роли пользователей в системе. Например admin, user, modeerator

  */
	const Role = sequelize.define(
    'Role', 
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
      tableName: 'roles',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true,
      classMethods: {
        associate: (models) => {
          // Пользователь может иметь только одну роль. Роль имеет много пользователей.
          Role.hasMany(models.User, { foreignKey: 'role_id' })
        }
      }
	  }
  )

	return Role

}

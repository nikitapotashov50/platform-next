module.exports = (sequelize, DataTypes) => {
  /*
    Модель описывает принадлежность пользователя к программам БМ.
    Каждый пользователь может проходить несколько программ. Как одновременно, так и друг после друга.
  */
	const UserProgram = sequelize.define(
    'UserProgram', 
    {
      /*
        Поле для статистики. Отображает цену, за которую пользователь приобрел программу
      */
      price: {
        type: DataTypes.INTEGER
      },
      /*
        Поле, отображающее подтверждение регистрации пользователя в программе.
        Сделано для того, чтобы после регистрации в CRM (где покупалась программа), можно было единоразово отправить пользователю приглашение в систему.
      */
      is_activated: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
      },
      /*
        Дата активации пользователя в программе
      */
      activated_at: {
        type: DataTypes.DATE
      },
      /*
        Уникальный хэш-код (bcrypt) для создания ссылки для отправки пользователю приглашения в систему
      */
      hash: {
        type: DataTypes.STRING(60).BINARY
      }
    },
    {
      tableName: 'users_programs',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true,
      classMethods: {
        associate: (models) => {
          // Пользователь проходит прогрпмму в определенном городе]
          UserProgram.belongsTo(models.City, { foreignKey: 'city_id' })

          // Программа
          UserProgram.belongsTo(models.Program, { foreignKey: 'program_id' })

          // Пользователь
          UserProgram.belongsTo(models.User, { foreignKey: 'user_id' })
        }
      }
    }
  )

  return UserProgram
}
module.exports = (sequelize, DataTypes) => {
  /*
    Модель описывает программы БМ.
    Для каждого потока ЦЕХа или МЗС создается отдельная запись, чтобы грамотно сегментировать пользователей по программам
  */
  const Program = sequelize.define(
    'Program',
    {
      // наименование программы с порядковым номером
      title: {
        allowNull: false,
        type: DataTypes.STRING
      },
      // англоязычное наименование программы, без пробелов и смс, для построения ссылок и пр.
      alias: {
        allowNull: false,
        type: DataTypes.STRING
      },
      // дата начала проведения программы
      start_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      // дата окончания программы
      finish_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      // на всякий случай - флаг активности программы.
      is_enabled: {
        defaultValue: true,
        type: DataTypes.BOOLEAN
      }
    },
    {
      tableName: 'programs',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true,
      classMethods: {
        associate: (models) => {
          // В каждой программе может быть много постов
          Program.belongsToMany(models.Post, { through: 'programs_posts', foreignKey: 'program_id' })

          // В каждой программе участвует множество человек
          Program.belongsToMany(models.User, { foreignKey: 'program_id', through: models.UserProgram })

          // В программе могут быть занятия
          Program.hasMany(models.ProgramClass, { foreignKey: 'program_id', as: 'Classes' })

          // группа может принадлежать программе
          Program.belongsToMany(models.Group, { foreignKey: 'program_id', as: 'Groups', through: 'programs_groups' })

          // Программе выставляют оценки
          Program.belongsToMany(models.NPS, { through: 'nps_program', foreignKey: 'program_id', as: 'Nps' })

          // в программе много заданий
          Program.hasMany(models.TaskEntry, { foreignKey: 'program_id', as: 'Tasks' })

          // В программе есть много пользователей со своими пролями
          Program.hasMany(models.UserProgramRole, { foreignKey: 'program_id' }) 
        }
      }
    }
  )

  return Program
}
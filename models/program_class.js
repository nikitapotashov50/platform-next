module.exports = (sequelize, DataTypes) => {
  /*
    Модель описывает занятия в рамках программ. Например, занятия ЦЕХа каждую субботу и т.д.
    Создана для правильной сборки статистики и рейтингов по дням и т.д.
    Так же можно будет сюда же прикреплять контент, задания и т.д.
  */
  const ProgramClass = sequelize.define(
    'ProgramClass',
    {
      title: {
        allowNull: false,
        type: DataTypes.STRING
      },
      // дата проведения занятия
      held_at: {
        type: DataTypes.DATE
      }
    },
    {
      tableName: 'programs_classes',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true,
      classMethods: {
        associate: (models) => {
          // Занятие обязательно принадлежить программе
          ProgramClass.belongsTo(models.Program, {
            foreignKey: { allowNull: false, field: 'program_id' }
          })

          // ЗАнятие может быть оценено
          ProgramClass.belongsToMany(models.NPS, { through: 'nps_classes', foreignKey: 'program_class_id', as: 'Nps' })
        }
      }
    }
  )

  return ProgramClass
}

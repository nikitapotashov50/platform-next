module.exports = (sequelize, DataTypes) => {
  const GroupMigrations = sequelize.define(
    'GroupMigrations',
    {
      user_id: {
        type: DataTypes.INTEGER
      },
      current_program: {
        type: DataTypes.INTEGER
      },
      all_programs: {
        type: DataTypes.INTEGER
      },
      coach_group: {
        type: DataTypes.TEXT
      },
      coach_group_program: {
        type: DataTypes.TEXT
      },
      ten_group: {
        type: DataTypes.TEXT
      },
      ten_group_program: {
        type: DataTypes.TEXT
      },
      ten_group_hundred: {
        type: DataTypes.TEXT
      },
      hundred_group: {
        type: DataTypes.TEXT
      },
      hundred_group_program: {
        type: DataTypes.TEXT
      },
      hundred_group_polk: {
        type: DataTypes.TEXT
      },
      polk_group: {
        type: DataTypes.TEXT
      },
      polk_group_program: {
        type: DataTypes.TEXT
      },
      type: {
        type: DataTypes.STRING
      },
      money: {
        type: DataTypes.BIGINT
      },
      total_score: {
        type: DataTypes.DOUBLE
      }
    },
    {
      tableName: 'migrations_groups_view',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true
    }
  )

  return GroupMigrations
}

module.exports = (sequelize, DataTypes) => {
  /*
    Модель описывает города.
    Пока что город привязывается только к участию пользователя в программе.
  */
	const City = sequelize.define('City', {
      name: {
        unique: true,
        type: DataTypes.STRING
      },
      lat: {
        type: DataTypes.DOUBLE
      },
      lng: {
        type: DataTypes.DOUBLE
      },
      region_id: {
        type: DataTypes.INTEGER,
        references: {
          key: 'id',
          model: 'regions'
        }
      }
    },
    {
      tableName: 'cities_view',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: true,
      underscored: true,
      classMethods: {
        associate: (models)=> {
          City.hasMany(models.UserProgram, { foreignKey: 'city_id' })
          City.belongsTo(models.Region)
        }
      }
    }
  );
  
  return City
};
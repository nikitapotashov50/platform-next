module.exports = (sequelize, DataTypes) => {
  const Region = sequelize.define('Region', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      iso3166: {
        type: DataTypes.STRING
      },
      region_geometry_feature: {
        type: DataTypes.TEXT,
        get: function () {
          try {
            return JSON.parse(this.getDataValue('region_geometry_feature'));
          } catch (e){
            return null
          }
        },
        set: function (value) {
          return this.setDataValue('region_geometry_feature', JSON.stringify(value));
        }
      }
    },
    {
      tableName: 'regions',
      createdAt: false,
      updatedAt: false,
      timestamps: true,
      underscored: true,
      classMethods: {
        associate: (models) => {
          Region.hasMany(models.City)
        }
      }
    }
  );

  return Region;

}
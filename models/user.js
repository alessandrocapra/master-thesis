'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    high_score: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: false
  });
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Calibration, {
      foreignKey: 'userId',
      as: 'calibrations',
    });
  };
  return User;
};

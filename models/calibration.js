'use strict';
module.exports = (sequelize, DataTypes) => {
  var Calibration = sequelize.define('Calibration', {
    max_inhale: DataTypes.INTEGER,
    max_exhale: DataTypes.INTEGER
  }, {});
  Calibration.associate = function(models) {
    // associations can be defined here
    Calibration.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };
  return Calibration;
};

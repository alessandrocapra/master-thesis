'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    max_inhale: DataTypes.INTEGER,
    max_exhale: DataTypes.INTEGER,
    high_score: DataTypes.INTEGER
  }, {
    timestamps: false
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};

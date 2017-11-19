const Sequelize = require('sequelize');
const db = require('../db');

//Model Definition
const Lots = db.define('lots', {
  latitude: {
    type: Sequelize.FLOAT,
    allowNull: true,
    defaultValue: null,
  },
  longitude: {
    type: Sequelize.FLOAT,
    allowNull: true,
    defaultValue: null,
  },
  spotsAvailable: {
    type: Sequelize.BOOLEAN
  }
});


//Class Methods
Lots.addSpotOnServer = function (spot){
  return Lots.create(spot);
};

//Export
module.exports = Lots;

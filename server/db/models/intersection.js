const Sequelize = require('sequelize');
const db = require('../db');

const Intersection = db.define('intersection', {
  currentStreet: {
    type: Sequelize.STRING,
  },
  intersectStreet: {
    type: Sequelize.STRING,
  },
  latitude: {
    type: Sequelize.FLOAT,
  },
  longitude: {
    type: Sequelize.FLOAT,
  }
})

module.exports = Intersection;

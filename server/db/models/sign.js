const Sequelize = require('sequelize');
const db = require('../db');

const Sign = db.define('sign', {
  area: {
    type: Sequelize.STRING,
  },
  rule: {
    type: Sequelize.STRING,
  },
  sequence: {
    type: Sequelize.STRING,
  },
  distance: {
    type: Sequelize.STRING,
  },
  side: {
    type: Sequelize.STRING,
    allowNull: true
  },
  description: {
    type: Sequelize.TEXT
  },
  code: {
    type: Sequelize.STRING
  }
})

module.exports = Sign;

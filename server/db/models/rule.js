const Sequelize = require('sequelize');
const db = require('../db');

const Rule = db.define('rule', {
  area: {
    type: Sequelize.STRING,
  },
  rule: {
    type: Sequelize.STRING,
  },
  mainStreet: {
    type: Sequelize.STRING,
  },
  fromStreet: {
    type: Sequelize.STRING,
  },
  toStreet: {
    type: Sequelize.STRING,
  },
  sos: {
    type: Sequelize.STRING
  }
})

module.exports = Rule;

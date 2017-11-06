const Sequelize = require('sequelize')
const db = require('../db')

const Streetspots = db.define('streetspots', {
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
  status: {
    type: Sequelize.STRING,
    defaultValue: 'open'
  },
  size: {
    type: Sequelize.STRING
  }
},
{
  validate: {
    bothCoordsOrNone() {
      if ((this.latitude === null) !== (this.longitude === null)) {
        throw new Error('Require either both latitude and longitude or neither')
      }
    }
  }
});

module.exports = Streetspots

Streetspots.prototype.getTimer = function(){
  return this.createdAt
}

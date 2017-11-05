const Sequelize = require('sequelize')
const db = require('../db')

const Streetspots = db.define('streetspots', {
  latitude: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  longitude: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: null,
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
  console.log('this',this)
  return this.createdAt
}

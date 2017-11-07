const Sequelize = require('sequelize')
const db = require('../db')
const User = require('./user')

//Model Definition
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


//Class Methods
Streetspots.addSpotOnServer = function (spot, id){
  let newSpot;
  return Streetspots.create(spot)
    .then((_spot) => {
      newSpot = _spot
      return User.findOne({where: {id}})
    })
    .then((user) => newSpot.setUser(user))
}

//Export
module.exports = Streetspots

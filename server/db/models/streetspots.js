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
    type: Sequelize.STRING,
    defaultValue: 'mid-size car'
  },
  timer: {                        // I needed this to run the program, even though I don't have any user case :(
    type: Sequelize.TIME
  },
  mainStreet: {
    type: Sequelize.STRING
  },
  crossStreet1: {
    type: Sequelize.STRING
  },
  crossStreet2: {
    type: Sequelize.STRING
  },
  images: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    defaultValue: ['/public/images/noimage.png']
  },
  fromStreet: {
    type: Sequelize.STRING
  },
  gotoStreet: {
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
    },
    getterMethods: {
      sizeUrl: function () {
        switch (this.size) {
          case 'full-size SUV':
            return '/public/images/suv.png';
          case 'full-size car':
            return '/public/images/fullcar.png';
          case 'mid-size car':
            return '/public/images/midcar.png';
          case 'compact car':
            return '/public/images/compact.png';
          default:
            return '/public/images/midcar.png';
        }
      }
    }

  });


//Class Methods
Streetspots.addSpotOnServer = function (spot, id) {
  let newSpot;
  return Streetspots.create(spot)
    .then(createdSpot => {
      createdSpot.status = 'closed';
      return createdSpot.save();
    })
    .then((_spot) => {
      newSpot = _spot
      console.log("___Creating a spot AND Timer start___")
      // run countdown on user reported spot
      return Streetspots.statusController(newSpot);
    })
    .then(() => {
      return User.findById(id)
    })
    .then(user => newSpot.setUser(user))
    .then(() => {
      return newSpot;
    })
}

//Export
module.exports = Streetspots;

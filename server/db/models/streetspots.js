const Sequelize = require('sequelize')
const db = require('../db')
const User = require('./user')
const Stopwatch = require('timer-stopwatch');

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
    sizeUrl: function() {
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


// class method to control the status of a given instance
Streetspots.statusController = (spot) => {
  const watch = new Stopwatch(240000); // A new countdown timer with 60 seconds
  watch.start();                      // count down starts

  // Fires when the timer is done
  return watch.onDone(function () {
    console.log('Watch is complete, Changing status');
    spot.status = "expired";
    return spot.save();
  });
}
//Class Methods
Streetspots.addSpotOnServer = function (spot, id) {
  let newSpot;
  return Streetspots.create(spot)
    .then((_spot) => {
      newSpot = _spot
      console.log("CREATING SPOT AT DB HERE AND RUNNING timer")
      // run countdown on user reported spot
      return Streetspots.statusController(newSpot);
    })
    .then(() => {
      return User.findById(id)
    })
    .then( user => newSpot.setUser(user))
    .then( ()=> {
      return newSpot;
    })

}

//Export
module.exports = Streetspots

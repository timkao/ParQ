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
    type: Sequelize.STRING
  },
  timer: {                        // I needed this to run the program, even though I don't have any user case :(
    type: Sequelize.TIME
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

// class method to control the status of a given instance
Streetspots.statusController = (spot) => {
  const watch = new Stopwatch(60000); // A new countdown timer with 60 seconds
  watch.start();                      // count down starts

  // Fires when the timer is done 
  return watch.onDone(function () {
    console.log('Watch is complete');
    spot.status = "occupied";
    return spot.save();
  });
}


//Class Methods
Streetspots.addSpotOnServer = function (spot, id) {
  let newSpot;
  return Streetspots.create(spot)
    .then((_spot) => {
      newSpot = _spot
      // run countdown on user reported spot
      return Streetspots.statusController(newSpot);
    })
    .then(() => {
      return User.findById(id);
    })
    .then((user) => newSpot.setUser(user))
}

//Export
module.exports = Streetspots

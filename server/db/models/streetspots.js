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
  timer: {
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

// instance method is not working because this.save is not a function, why?
Streetspots.prototype.statusController = () => {
  console.log("inside of statusController");
  const watch = new Stopwatch(60000); // A new countdown timer with 60 seconds
  watch.start();                      // count down starts

  // Fires when the timer is done 
  watch.onDone(function () {
    console.log('Watch is complete');
    this.status = "occupied";
    return this.save();
  });
}

// class method to control the status of a given instance
Streetspots.statusController = (spot) => {
  const watch = new Stopwatch(10000); // A new countdown timer with 10 seconds
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
      // run count down on user reported spot
      return Streetspots.statusController(newSpot);
    })
    .then(() => {
      return User.findById(id);
    })
    .then((user) => newSpot.setUser(user))
}

//Export
module.exports = Streetspots

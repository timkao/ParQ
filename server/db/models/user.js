const crypto = require('crypto');
const Sequelize = require('sequelize');
const db = require('../db');

const User = db.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING
  },
  salt: {
    type: Sequelize.STRING
  },
  googleId: {
    type: Sequelize.STRING
  },
  registeredVehicle: {
    type: Sequelize.STRING
  },
  socketId: {
    type: Sequelize.STRING
  },
  notifications: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    defaultValue: []
  },
  spotsTaken: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  points: {
    type: Sequelize.INTEGER,
    defaultValue: 100
  }
}, {
  getterMethods: {
    rankCar: function(){
      if (this.points < 1000) {
        return '/public/images/babycar.png';
      } else if (this.points < 2000) {
        return '/public/images/bumpercar.png';
      } else if (this.points < 3000) {
        return '/public/images/gokart.png';
      } else if (this.points < 4000) {
        return '/public/images/wagon.png';
      } else {
        return '/public/images/bigbar.png';
      }
    }
  }
});

module.exports = User;

User.prototype.produceSalt = function() {
	return crypto.randomBytes(16).toString('base64');
};

User.prototype.securePassword = function(userInput, salt) {
	return crypto.createHash('RSA-SHA256')
	.update(userInput)
	.update(salt)
	.digest('hex');
};

User.prototype.verifyPassword = function(passwordInput) {
	return this.securePassword(passwordInput, this.salt) === this.password;
}

function setSaltAndPassword(user) {
	if (user.changed('password')) {
		user.salt = user.produceSalt();
		user.password = user.securePassword(user.password, user.salt);
	}
}

User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);


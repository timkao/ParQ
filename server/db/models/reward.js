const Sequelize = require('sequelize')
const db = require('../db')

const Reward = db.define("reward", {
    points: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    }
});

// get user rankig based on the number of points
const rankings = (points) => {
    let rank = 'Just a happy member';
    if (points >= 30) {
        rank = "Mad Helper: helped more than  30 people find parking spots."
    }
    else if (points >= 20 && points < 30) {
        rank = "Crazy Helper: helped more than  20 people find parking spots."
    }
    else if (points >= 10 && points < 20) {
        rank = "Incredible Helper: helped more than 10 people find parking spots."
    }
    else if (points >= 1 && points < 10) {
        rank = "Excited Helper: Love helpig people find parking spots."
    }
    return rank;
}

// instance method for rank
Reward.prototype.rank = function () {
    return rankings(this.points);
}

module.exports = Reward;
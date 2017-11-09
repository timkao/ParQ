const Sequelize = require('sequelize')
const db = require('../db')

const Reward = db.define("reward", {
      points : {
          type : Sequelize.INTEGER,
          defaultValue : 0
      }
})

Reward.prototype.rank = function(){
}

module.exports = Reward;
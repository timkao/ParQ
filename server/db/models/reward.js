const Sequelize = require('sequelize')
const db = require('../db')

const Reward = db.define("reward", {
      points : {
          type : Sequelize.INTEGER,
          defaultValue : 0
      }
});

// get user rankig based on the number of points
const rankings = (points)=>{
  let rank = 'Just a happy member';
  if(points >= 30){
      rank = "Gold: helped more than  30 people find parking spots."
  }
  else if(points >= 20 && points < 30){
      rank = "Premium:  helped more than  20 people find parking spots."
  }
  else if(points >= 10 && points < 20){
      rank = "Almost a Premium member: helped more than 10 people find parking spots."
  }
  else if(points >= 1 && points < 10){
      rank = "love helpig people find parking spots."
  }
  return rank;
}
Reward.prototype.rank = function(){
    return rankings(this.points);
}

module.exports = Reward;
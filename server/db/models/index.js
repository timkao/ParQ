const User = require('./user');
const Streetspots = require('./streetspots');
const Lots = require('./lots');

/* Associations ================================== */
Streetspots.belongsTo(User)
User.hasMany(Streetspots)

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  User,
  Streetspots,
  Lots
}

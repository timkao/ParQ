const db = require('./db')

// register models
require('./models');

//seed data for testing (can remove!)
db.seed = () => require('./models/seed')(require('./models/user'), require('./models/streetspots'), require('./models/lots'));

module.exports = db;

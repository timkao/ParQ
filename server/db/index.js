const db = require('./db')

// register models
require('./models');

//seed data for testing (can remove!)
<<<<<<< HEAD
db.seed = () => require('./models/seed')(require('./models/user'), require('./models/streetspots'), 
                                                require('./models/reward'));
=======
db.seed = () => require('./models/seed')(require('./models/user'), require('./models/streetspots'), require('./models/lots'));
>>>>>>> a4274a5dd2d8971db123285fbdf92e6c9182dbb7

module.exports = db;

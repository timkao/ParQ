const chalk = require('chalk')
/*
Note to Tim:
  Built this seed file to do some model testing. Please
 feel free to modify or destroy !

*/


// Seed data
const users = [
    {name: 'Test', password: '123', email: 'test@test.com'}
];

const streetspots = [
  { latitude: 1234, longitude: 12412 },
  { latitude: 5334, longitude: 8797987 },
  { latitude: 98098, longitude: 987879 },
]

//Export
module.exports = (User, Streetspots) => {
  let user1;
    //user creation
  return Promise.all(
      users.map((user) => User.create(user))
    )
  .then(([_u1]) => {
    user1 = _u1;
    return Promise.all(
      streetspots.map((location) => Streetspots.create(location))
    )})
  .then(([_lot1, _lot2, _lot3]) => {
    return Promise.all([
      _lot1.setUser(user1),
      _lot2.setUser(user1),
      _lot3.setUser(user1),
    ])
  .then(() => console.log(chalk.green('DB is synced and seeded')));
  })
  .catch((err) => {
    console.log('seed error:')
    console.log(err)
  })
};

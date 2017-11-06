const chalk = require('chalk')

// Seed data
const users = [
    {name: 'Test', password: '123', email: 'test@test.com'},
    {name: 'Queen', password: '123', email: 'queen@test.com'}
];

const streetspots = [
  { latitude: 40.7152989, longitude: -74.01153299999999 },
  { latitude: 40.73336740000001, longitude: -73.98670679999998},
  { latitude: 40.750955, longitude: -73.999572 },
  { latitude: 40.75220700000001, longitude: -73.992729 },
  { latitude: 40.7408902, longitude: -73.9947929 }
]

//Export
module.exports = (User, Streetspots) => {
  let user1, user2;
    //user creation
  return Promise.all(
      users.map((user) => User.create(user))
    )
  .then(([_u1, _u2]) => {
    user1 = _u1;
    user2 = _u2;
    return Promise.all(
      streetspots.map((location) => Streetspots.create(location))
    )})
  .then(([_lot1, _lot2, _lot3, _lot4]) => {
    return Promise.all([
      _lot1.setUser(user1),
      _lot2.setUser(user1),
      _lot3.setUser(user2),
      _lot4.setUser(user2),
    ])
  .then(() => console.log(chalk.green('DB is synced and seeded')));
  })
  .catch((err) => {
    console.log('seed error:')
    console.log(err)
  })
};

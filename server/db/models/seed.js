const chalk = require('chalk');

// Seed data
const users = [
    {name: 'Test', password: '123', email: 'test@test.com', points: 900},
    {name: 'Queen', password: '123', email: 'queen@test.com', points: 500},
    {name: 'Tim', password: '123', email: 'tim@test.com', points: 1500}
];

const streetspots = [
  { latitude: 40.7152989, longitude: -74.01153299999999, size: 'compact car' },
  { latitude: 40.73336740000001, longitude: -73.98670679999998, size: 'mid-size car'},
  { latitude: 40.750955, longitude: -73.999572, size: 'full-size car' },
  { latitude: 40.75220700000001, longitude: -73.992729, size: 'full-size SUV' },
  { latitude: 40.7408902, longitude: -73.9947929, size: 'full-size SUV' },
  { latitude: 40.75486175810943, longitude: -73.99149451085543, size: 'full-size car' },
  { latitude: 40.75603844785587, longitude: -73.99112189192192, size: 'mid-size car' },
  { latitude: 40.75809432300878, longitude: -73.99005119893565, size: 'mid-size car' },
  { latitude: 40.754736989431535, longitude: -73.99348737644738, size: 'compact car' },
  { latitude: 40.75262442297549, longitude: -73.99049939597558, size: 'full-size SUV' },
  { latitude: 40.748723, longitude: -74.037123, size: 'mid-size car' },
  { latitude: 40.21733690809492, longitude: -74.00885645263406, size: 'full-size SUV'},
  { latitude: 40.21892624348152, longitude: -74.01105586401843, size: 'full-size SUV'},
  { latitude: 40.21892624348152, longitude: -74.00692526212578, size: 'full-size SUV'}
];

const parkingLots = [
  { latitude: 40.746761510630904, longitude: -74.03633671585777, spotsAvailable: true},
  { latitude: 40.74536344788464, longitude: -74.02640181367153, spotsAvailable: false},
  { latitude: 40.74295718029131, longitude: -73.99603504488482, spotsAvailable: true},
  { latitude: 40.75125142382677, longitude: -73.98424684750455, spotsAvailable: true}
];

//Export
module.exports = (User, Streetspots, Reward, Lots) => {
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
    );
  })
  .then(([_lot1, _lot2, _lot3, _lot4, _lot5, _lot6, _lot7, _lot8, _lot9, _lot10, _lot11, _lot12, _lot13, _lot14]) => {
    return Promise.all([
      _lot1.setUser(user1),
      _lot2.setUser(user1),
      _lot3.setUser(user2),
      _lot4.setUser(user2),
      _lot5.setUser(user1),
      _lot6.setUser(user1),
      _lot7.setUser(user2),
      _lot8.setUser(user2),
      _lot9.setUser(user1),
      _lot10.setUser(user1),
      _lot11.setUser(user1),
      _lot12.setUser(user2),
      _lot13.setUser(user2),
      _lot14.setUser(user1)
    ]);
  })
  .then(() => {
    Promise.all(
      parkingLots.map((location) => Lots.create(location))
    );
  })
  .then(() => console.log(chalk.green('DB is synced and seeded')))
  .catch((err) => {
    console.log('seed error:');
    console.log(err);
  });
};

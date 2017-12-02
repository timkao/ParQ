const router = require('express').Router()
const { User } = require('../db/models')
const { Reward } = require('../db/models')
module.exports = router

// route: /api/users
router.get('/', (req, res, next) => {
  User.findAll({
    attributes: ['id', 'email'],
    include: [{ model: Reward }]    // include reward
  })
    .then(users => res.json(users))
    .catch(next)
})

router.put('/updateSpotsTaken', (req, res, next) => {
  User.findById(req.user.id)
    .then(user => {
      user.spotsTaken = 0;
      return user.save();
    })
    .then(user => res.send(user))
    .catch(err => console.log(err));
})

router.put('/updatePoints', (req, res, next) => {
  User.findById(req.user.id)
    .then(user => {
      user.points += 100 * req.body.num;
      return user.save();
    })
    .then(user => res.send(user))
    .catch(err => console.log(err));
})

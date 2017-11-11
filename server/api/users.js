const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router

// route: /api/users

router.get('/', (req, res, next) => {
  User.findAll({
    attributes: ['id', 'email']
  })
    .then(users => res.json(users))
    .catch(next)
})

router.put('/updateSpotsTaken', (req, res, next) => {
  User.findById(req.user.id)
  .then( user => {
    user.spotsTaken = 0;
    return user.save();
  })
  .then( user => res.send(user))
  .catch(err => console.log(err));
})

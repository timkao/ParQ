const router = require('express').Router()
const {User} = require('../db/models')
const {Reward} = require('../db/models')
module.exports = router

// route: /api/users

router.get('/', (req, res, next) => {
  User.findAll({
    attributes: ['id', 'email'],
    include: [{model: Reward}]
  })
    .then(users => res.json(users))
    .catch(next)
})

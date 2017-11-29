const router = require('express').Router()
const User = require('../db/models/user');
const Reward = require('../db/models/reward');   // just testing it now
module.exports = router

router.post('/login', (req, res, next) => {
  User.findOne({where: {email: req.body.email}})
    .then(user => {
      if (!user) {
        res.status(401).send('User not found')
      } else if (!user.verifyPassword(req.body.password)) {
        res.status(401).send('Incorrect password')
      } else {
        req.login(user, err => err ? next(err) : res.json(user))
      }
    })
    .catch(next)
})

router.post('/signup', (req, res, next) => {
  User.create(req.body)
    .then(user => {
      req.login(user, err => err ? next(err) : res.json(user))
    })
    .catch(err => {
      if (err.name === 'SequelizeUniqueConstraintError')
        res.status(401).send('User already exists')
      else next(err)
    })
})

router.post('/logout', (req, res) => {
  User.findById(req.user.id)
  .then( user => {
    user.socketId = null;
    return user.save();
  })
  .then( () => {
    req.logout()
    res.redirect('/')
  })
  .catch( err => console.log(err));
})

router.get('/me', (req, res) => {
  if (req.user) {
    User.findById(req.user.id)
      .then( user => {          // just to check
        // console.log("CHECK USER at GET /auth/me", user.get());
        return user;
      })
      .then(user => res.json(user))
    // test code
    // .then( user => {                    // testing
    //   return Reward.create({points: 20})
    //     .then( reward=>{
    //       return user.setReward(reward);      // set new reward to the user
    //     })
    //     .then(user => {
    //         return Reward.findById(user.rewardId)
    //           .then(reward=>{
    //             console.log(reward.get());
    //             return reward;
    //           })
    //           .then( reward=> res.json(user));
    //         // res.json(user);
    //     })
    // })
  } else {
    res.sendStatus(204);
  }
})

router.use('/google', require('./google'))

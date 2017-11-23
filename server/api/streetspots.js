const router = require('express').Router()
const { Streetspots, User } = require('../db/models')
module.exports = router
// const moment = require('moment')

//GET all spots
router.get('/', (req, res, next) => {
  Streetspots.findAll({where: {status: 'open'}})
  .then((spots) => res.send(spots))
  .catch(next)
})

//GET spot by ID
router.get('/:spotId', (req, res, next) => {
  Streetspots.findOne({ where: { id: req.params.spotId }})
  .then((spot) => res.send(spot))
  .catch(next)
})

//POST to create a new spot
router.post('/:userId', (req, res, next) => {
  console.log("Checking the spot adding route");   // no logging at all yet
  Streetspots.addSpotOnServer(req.body, req.params.userId) //class method
  .then(() => res.sendStatus(201))
  .catch(next)
})

//DELETE to delete a spot - mostly for testing
router.delete('/:spotId', (req, res, next) => {
  Streetspots.destroy({ where: { id: req.params.spotId }})
  .then(() => res.sendStatus(200))
  .catch(next)
})

//UPDATE Spot status from "open" to "occupied"
router.put('/:spotId', (req, res, next) => {
  Streetspots.findById(req.params.spotId, {include: [User]})
  .then( spot => {
    spot.status = 'occupied'
    return spot.save()
  })
  .then( spot => { res.send(spot.user) })
  .catch(next)
})

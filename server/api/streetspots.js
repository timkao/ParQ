const router = require('express').Router()
const { Streetspots } = require('../db/models')
module.exports = router
// const moment = require('moment')

//GET all spots
router.get('/', (req, res, next) => {
  Streetspots.findAll()
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

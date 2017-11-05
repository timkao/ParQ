const router = require('express').Router()
const { Streetspots } = require('../db/models')
module.exports = router

//GET all spots
router.get('/', (req, res, next) => {
  Streetspots.findAll()
  .then((spots) => res.send(spots))
  .catch(next)
})

//GET spot by ID
router.get('/:id', (req, res, next) => {
  Streetspots.findOne({ where: { id: req.params.id }})
  .then((spot) => res.send(spot))
  .catch(next)
})

//POST to create a new spot
router.post('/', (req, res, next) => {
  Streetspots.create(req.body)
  .then(() => res.sendStatus(201))
  .catch(next)
})

//DELETE to delete a spot - mostly for testing
router.delete('/:id', (req, res, next) => {
  Streetspots.destroy({ where: { id: req.params.id }})
  .then(() => res.sendStatus(200))
  .catch(next)
})

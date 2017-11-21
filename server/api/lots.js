const router = require('express').Router();
const { Lots } = require('../db/models');
module.exports = router;

//GET all lots
router.get('/', (req, res, next) => {
  Lots.findAll({where: {spotsAvailable: true}})
  .then((lots) => {
    res.send(lots);
  })
  .catch(next);
});

//GET spot by ID
// router.get('/:spotId', (req, res, next) => {
//   Streetspots.findOne({ where: { id: req.params.spotId }})
//   .then((spot) => res.send(spot))
//   .catch(next)
// })

//POST to create a new spot
// router.post('/:userId', (req, res, next) => {
//   Streetspots.addSpotOnServer(req.body, req.params.userId) //class method
//   .then(() => res.sendStatus(201))
//   .catch(next)
// })

//DELETE to delete a lot - mostly for testing
// router.delete('/:lotId', (req, res, next) => {
//   Streetspots.destroy({ where: { id: req.params.lotId }})
//   .then(() => res.sendStatus(200))
//   .catch(next)
// })



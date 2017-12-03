const router = require('express').Router()
const { Intersection } = require('../db/models')
const axios = require('axios');
module.exports = router

// route: /api/intersections

router.get('/:currentStreet', (req, res, next) => {
  Intersection.findAll({where: {currentStreet: req.params.currentStreet}})
  .then( intersectStreets => {
    res.send(intersectStreets);
  })
  .catch(next);
})

// should change to restful route later
router.put('/distance', (req, res, next) => {
  console.log(req.body);
  const queryString =`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${req.body.origin}&destinations=${req.body.destination}&mode=${req.body.mode}&units=imperial&key=${process.env.GOOGLE_DISTANCE_SECRET}`;

  axios.get(queryString)
  .then( result => result.data )
  .then( data => {
    console.log(data);
    res.send(data);
  })
  .catch(err => console.log(err))
})

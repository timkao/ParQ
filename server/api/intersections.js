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
  //console.log(req.body);
  const queryString =`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${req.body.origin}&destinations=${req.body.destination}&mode=walking&units=imperial&key=AIzaSyBW_EFFCEHC3ETI49Nx6749KVUgXXHswp8`;

  axios.get(queryString)
  .then( result => result.data )
  .then( data => {
    res.send(data);
  })
  .catch(err => console.log(err))
})

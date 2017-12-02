const router = require('express').Router()
const axios = require('axios');
module.exports = router;


// should change to restful route later
router.put('/', (req, res, next) => {
  console.log(req.body);
  const queryString =`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${req.body.origin}&destinations=${req.body.destination}&mode=${req.body.mode}&units=imperial&key=${process.env.GOOGLE_DISTANCE_SECRET}`;

  axios.get(queryString)
  .then( result => result.data )
  .then( data => {
    res.send(data);
  })
  .catch(err => console.log(err))
})

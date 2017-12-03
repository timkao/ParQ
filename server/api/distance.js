const router = require('express').Router()
const axios = require('axios');
module.exports = router;


// should change to restful route later
router.put('/', (req, res, next) => {
  console.log(req.body);
  const queryString =`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${req.body.origin}&destinations=${req.body.destination}&mode=${req.body.mode}&units=imperial&key=AIzaSyBH_cnsaqmKXVPYfANLq_sfPqrQqBS0j9o`;

  axios.get(queryString)
  .then( result => result.data )
  .then( data => {
    console.log(data);
    res.send(data);
  })
  .catch(err => console.log(err))
})

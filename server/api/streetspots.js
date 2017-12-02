const router = require('express').Router()
const { Streetspots, User } = require('../db/models')
const AWS = require('aws-sdk');
const axios = require('axios');

module.exports = router

//GET all spots
router.get('/', (req, res, next) => {

  // Longitude: -74.00906637487267
  const lng = -74.00906637487267
  // Latitude: 40.70502433805882
  const lat = 40.70502433805882
  const api = process.env.AUNG_GOOGLE_API_KEY;
  const queryString = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&types=parking&key=${api}`;
  axios.get(queryString)
      .then( result=> {
          const status = result.data.status;
          const results = result.data.results;
          console.log(status, "results:", results.length);
          results.forEach( each => {
            console.log(Object.keys(each));
          }
      })
      .catch(err => console.log(err))

  // Streetspots.findAll({ where: { status: 'open' } })
  //   .then((spots) => res.send(spots))
  //   .catch(next);
})

//GET spot by ID
router.get('/:spotId', (req, res, next) => {
  Streetspots.findOne({ where: { id: req.params.spotId } })
    .then((spot) => res.send(spot))
    .catch(next)
})

//POST to create a new spot
router.post('/:userId', (req, res, next) => {
  Streetspots.addSpotOnServer(req.body, req.params.userId) //class method
    .then(newSpot => {
      // testing purpose
      return res.send(newSpot)
    })
    //.then(() => res.sendStatus(201))
    .catch(next)
})

//DELETE to delete a spot - mostly for testing
router.delete('/:spotId', (req, res, next) => {
  Streetspots.destroy({ where: { id: req.params.spotId } })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// UPDATE Spot status from "open" to "occupied"
router.put('/:spotId', (req, res, next) => {
  Streetspots.findById(req.params.spotId, { include: [User] })
    .then(spot => {
      spot.status = 'occupied'
      return spot.save()
    })
    .then(spot => { res.send(spot.user) })
    .catch(next)
})

// UPDATE Spot size
router.put('/:spotId/size', (req, res, next) => {
  Streetspots.findById(req.params.spotId)
    .then(spot => {
      spot.size = req.body.size;
      return spot.save()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// UPLOAD to AWS and UPDATE Spot pictures
router.put('/:spotId/pictures', (req, res, next) => {
  AWS.config.update({ accessKeyId: process.env.awsKey, secretAccessKey: process.env.awsSecret });
  const fileUrls = [];
  Promise.all(req.body.pictures.map(function (file) {
    const buf = new Buffer(file.data_uri.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const s3 = new AWS.S3();
    return s3.upload({
      Bucket: 'parqapp',
      Key: file.filename,
      Body: buf,
      ACL: 'public-read'
    }).promise()
      .then(data => fileUrls.push(data.Location))
  }))
  .then(() => {
    return Streetspots.findById(req.params.spotId)
  })
  .then(spot => {
    spot.images = fileUrls;
    return spot.save();
  })
  .then(() => res.sendStatus(204))
  .catch(next);
})


const router = require('express').Router()
const { Streetspots, User } = require('../db/models')
const AWS = require('aws-sdk');

module.exports = router

//GET all spots
router.get('/', (req, res, next) => {
  Streetspots.findAll({ where: { status: 'open' } })
    .then((spots) => res.send(spots))
    .catch(next)
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
      spot.status = 'open';
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

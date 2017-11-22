const router = require('express').Router();
module.exports = router;

router.use('/users', require('./users'))
router.use('/streetspots', require('./streetspots'))
router.use('/intersections', require('./intersections'))
router.use('/rules', require('./rules'))


router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
})

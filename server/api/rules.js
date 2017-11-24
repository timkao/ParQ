const router = require('express').Router()
const { Rule, Sign } = require('../db/models')
module.exports = router

// route: /api/rules

router.put('/', (req, res, next) => {
  const onStreet = req.body.mainStreet;
  const street1 = req.body.crossStreet1;
  const street2 = req.body.crossStreet2;

  Rule.findAll({where: {
    mainStreet: onStreet,
    fromStreet: street1,
    toStreet: street2
  }})
  .then( totalRules => {
    return Promise.all(totalRules.map( rule => {
      return Sign.findAll({where: {rule: rule.rule}})
    }))
  })
  .then( signsObjs => {
    res.send(signsObjs);
  })
  .catch(err => console.log(err));
})

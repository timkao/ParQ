const router = require('express').Router()
const { Rule, Sign } = require('../db/models')
module.exports = router

// route: /api/rules

router.put('/', (req, res, next) => {
  const {onStreet, street1, street2} = req.body;
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
  .then( ruleObjs => {
    res.send(ruleObjs)
  })
})

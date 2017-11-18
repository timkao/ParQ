const fs = require('fs');
const csv = require('fast-csv');
const db = require('./server/db')

const Interseciton = db.models.intersection;
const pairs = [];

const seedIntersection = function() {

  Interseciton.sync({force: true});

  fs.createReadStream('./server/locations.CSV')
  .pipe(csv())
  .on('data', function(data){

    if (data[0] === 'M') {
      const pair = [data[2].trim(), data[3].trim()]
      let notDuplicate = true;
      for (var i = 0; i < pairs.length; i++) {
        if (pairs[i][0] == pair[0] && pairs[i][1] == pair[1]) {
          notDuplicate = false;
          break;
        }
      }
      if (notDuplicate) {pairs.push(pair)}
    }
  })
  .on('end', function(data){

    Promise.all(pairs.map( pair => {
      Interseciton.create({currentStreet: pair[0], intersectStreet: pair[1]})
    }))
    .then( () => {
      console.log('Store Finished');
    })

  })
}

//seedIntersection()

module.exports = seedIntersection

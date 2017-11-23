const fs = require('fs');
const csv = require('fast-csv');
const db = require('./server/db')

// this file just need to be seeded once

function streetNameTransform(str) {
  let arr = str.split(" ");
  arr = arr.filter(ele => ele.length > 0)
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[i].length; j++) {
      if (isNaN(parseInt(arr[i][j]))) {
        break;
      }
      if (j === arr[i].length - 1) {
        if (arr[i] == '11') {
          arr[i] = '11TH'
        }
        else if (arr[i] == '12') {
          arr[i] = '12TH'
        }
        else if (arr[i] == '13') {
          arr[i] = '13TH'
        }
        else if (arr[i][j] == '1') {
          arr[i] = arr[i] + 'ST'
        }
        else if (arr[i][j] == '2') {
          arr[i] = arr[i] + 'ND'
        }
        else if (arr[i][j] == '3') {
          arr[i] = arr[i] + 'RD'
        }
        else {
          arr[i] = arr[i] + 'TH'
        }
      }
    }
    switch (arr[i]) {
      case 'FIRST':
        arr[i] = '1ST'
        break;
      case 'SECOND':
        arr[i] = '2ND'
        break;
      case 'THIRD':
        arr[i] = '3RD'
        break;
      case 'FOURTH':
        arr[i] = '4TH'
        break;
      case 'FIFTH':
        arr[i] = '5TH'
        break;
      case 'SIXTH':
        arr[i] = '6TH'
        break;
      case 'SEVENTH':
        arr[i] = '7TH'
        break;
      case 'EIGHTH':
        arr[i] = '8TH'
        break;
      case 'NINTH':
        arr[i] = '9TH'
        break;
      case 'TENTH':
        arr[i] = '10TH'
        break;
      case 'ELEVENTH':
        arr[i] = '11TH'
        break;
      case 'TWELFTH':
        arr[i] = '12TH'
        break;
      default:
        break;
    }
  }
  return arr.join(" ");
}

const Interseciton = db.models.intersection;
const pairs = [];

const seedIntersection = function () {

  Interseciton.sync({ force: true })
    .then(() => {
      fs.createReadStream('./server/locations.CSV')
        .pipe(csv())
        .on('data', function (data) {

          if (data[0] === 'M') {
            const curr = data[2].trim();
            const intersect = data[3].trim();
            const intersect2 = data[4].trim();

            const pair = [streetNameTransform(curr), streetNameTransform(intersect)]
            let notDuplicate = true;
            for (var i = 0; i < pairs.length; i++) {
              if (pairs[i][0] == pair[0] && pairs[i][1] == pair[1]) {
                notDuplicate = false;
                break;
              }
            }
            if (notDuplicate) { pairs.push(pair) }

            const pair2 = [streetNameTransform(curr), streetNameTransform(intersect2)]
            let notDuplicate2 = true
            for (var j = 0; j < pairs.length; j++) {
              if (pairs[j][0] == pair2[0] && pairs[j][1] == pair2[1]) {
                notDuplicate2 = false;
                break;
              }
            }
            if (notDuplicate2) { pairs.push(pair2) }

          }
        })
        .on('end', function (data) {
          Promise.all(pairs.map(pair => {
            Interseciton.create({ currentStreet: pair[0], intersectStreet: pair[1] })
          }))
            .then(() => {
              console.log('Intersections Store Finished');
            })

        })
    })
}

const Rule = db.models.rule;
const rules = [];

const seedRule = function () {
  Rule.sync({ force: true })
    .then(() => {
      fs.createReadStream('./server/locations.CSV')
        .pipe(csv())
        .on('data', function (data) {
          if (data[0] === 'M') {
            const curr = data[2].trim();
            const intersect = data[3].trim();
            const intersect2 = data[4].trim();
            rules.push({
              area: data[0],
              rule: data[1].trim(),
              mainStreet: streetNameTransform(curr),
              fromStreet: streetNameTransform(intersect),
              toStreet: streetNameTransform(intersect2),
              sos: data[5]
            })
          }
        })
        .on('end', function (data) {
          Promise.all(rules.map(rule => {
            Rule.create(rule)
          }))
            .then(() => {
              console.log('Rules Store Finished');
            })

        })
    })

}

const Sign = db.models.sign;
const signs = [];

const seedSign = function () {
  Sign.sync({ force: true })
    .then(() => {
      fs.createReadStream('./server/signs.CSV')
        .pipe(csv())
        .on('data', function (data) {
          if (data[0] === 'M' && data[5] !== 'Description Not Available') {
            signs.push({
              area: data[0],
              rule: data[1].trim(),
              sequence: data[2],
              distance: data[3],
              side: data[4],
              description: data[5],
              code: data[6]
            })
          }
        })
        .on('end', function (data) {
          Promise.all(signs.map(sign => {
            Sign.create(sign)
          }))
            .then(() => {
              console.log('Signs Store Finished');
            })

        })
    })

}

seedIntersection()
seedRule()
seedSign()

module.exports = { seedIntersection, seedRule, seedSign }

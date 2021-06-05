
const fs = require('fs');

module.exports = (route) => {
  return readMyFile(route);
};

const readMyFile = (route) => {
  return new Promise ((resolve, reject) => {
    fs.readFile(route, 'utf8', (err, data) => {
      if (err) reject (err);
        resolve(data);
    })
  })
}
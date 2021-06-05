// Command Line Interface

const mdLinks = require('./index.js');

const path = process.argv[2];

mdLinks(path)
  .then(file => console.log(file))
  .catch(err => console.log('error', err));
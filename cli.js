//librerias de node.js
const {mdlinks} = require('./index.js');
const pathLib = require('path')

//Toma datos de consola
const path = process.argv[2];
let optionOne = process.argv[3];
let optionTwo = process.argv[4];

//Cambio de ruta relativa a absoluta
let dirPath = pathLib.resolve(path);

let options = {
    validate: false,
    stats: false
};

if (
    (optionOne === "--validate" && optionTwo === "--stats") ||
    (optionOne === "--stats" && optionTwo === "--validate")
) {
    options.validate = true;
    options.stats = true;
} else if (optionOne === "--validate") {
    options.validate = true;
    options.stats = false;
} else if (optionOne === "--stats") {
    options.validate = false;
    options.stats = true;
} else {
    options.validate = false;
    options.stats = false;
}

mdlinks(dirPath,options)
    .then(file => {
        console.log(file);
    })
    .catch(err => console.log('error', err));
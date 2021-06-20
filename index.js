//Librerías Node
const fs = require("fs");
const path = require('path');
const fetch = require("node-fetch");

let totalLinks = 0;
let uniqueLinks = 0;
let brokenLinks = 0;

// Define si la ruta es archivo o directorio
const fileOrDir = (Path) => {
  const dirPath = path.resolve(Path).replace(/\\/g, "/");
  return new Promise((resolve, rejects) => {
    fs.stat(dirPath, (err, stats) => {
      if (err) {
        rejects(new Error("No es una ruta valida"))
      } else if (stats.isFile()) {
        resolve(mdFiles(dirPath))
      } else if (stats.isDirectory()) {
        resolve(directory(dirPath))
      }
    });
  });
};
const directory = (dirPath) => {
  return new Promise((resolve, reject) => {
    const files = fs.readdirSync(dirPath);
    let directoryContent = [];
    files.forEach((arch, i) => {
      directoryContent[i] = fileOrDir(dirPath + "/" + arch)
    });
    Promise.all(directoryContent)
      .then((resultado) => {
        return resultado.reduce((acc, val) => acc.concat(val), []);
      })
      .then((resu) => {
        resolve(resu.filter((val) => typeof val === "object"));
      })
      .catch((error) => {
        reject(error);
      });
  })

}


const mdFiles = (dirPath) => {
  let ext = path.extname(dirPath).toLowerCase()
  if (ext === '.md') {
    return readFile(dirPath)
  }
}

// Obtiene los links del archivo
const getLinks = (file) => {
  const reg = /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g;
  return file.matchAll(reg);
};

//Lee el contenido del archivo 
const readFile = (dirPath) => {
  return new Promise((resolve, rejects) => {
    fs.readFile(dirPath, "utf-8", (error, data) => {
      if (error) {
        rejects(new Error("Error al leer el archivo"))
      }
      let links = [];
      let index = 0;
      //Recorre todos los links y almacena los datos como un array de objetos
      for (const url of getLinks(data)) {
        const obj = {
          href: url[2],
          text: url[1],
          file: dirPath,
        };
        //llenar array con el obj
        links[index] = obj;
        index++;
        //console.log(obj.href)
      }
      resolve(links);
    });
  });
};

//Valida los links con sus status
const toValidate = links => {
  return new Promise((resolve, reject) => {
    let statusLinks = links.map(link => {
      return fetch(link.href).then(res => {
        if (res.status === 200) {
          link.status = res.status;
          link.response = "O.K.";
        } else if (res.status === 404) {
          link.status = res.status;
          link.response = res.statusText;
          link.response = "FAIL";
        }
      });
    });
    Promise.all(statusLinks)
      .then(res => {
        resolve(links);

      }).catch(err => {
        links.status = null;
        links.response = "FAIL";
        resolve(links);
      });
  });
};

//Estadisticas de links totales y únicos
const statsOption = links => {
  return new Promise((resolve, reject) => {
    let allLinks = links.map(link => link.href);
    totalLinks += allLinks.length;
    uniqueLinks += [...new Set(allLinks)].length;
    let statsResult = {
      total: totalLinks,
      unique: uniqueLinks
    };
    resolve(statsResult);
  });
};

const statsToValidate = (links) => {
  console.log("links",links);
  return new Promise((resolve, reject) => {
    toValidate(links).then(link => {
      let allLinks = link.map(link => link.href);
      let statusLinks = links.map(link => link.response);
      let totalLinks = allLinks.length;
      uniqueLinks = [...new Set(allLinks)];
      brokenLinks += (statusLinks.toString().match(/FAIL/g));

      let statsResult = {
        total: totalLinks,
        unique: uniqueLinks.length,
        broken: brokenLinks.length
      }
      if (brokenLinks === 0) {
        statsResult = {
          total: totalLinks,
          unique: uniqueLinks.length,
          broken: 0
        }
        console.log("statsResult",statsResult);
        resolve(statsResult);
      } else {
        brokenLinks = (statusLinks.toString().match(/FAIL/g)).length;
        let statsResult = {
          total: totalLinks,
          unique: uniqueLinks.length,
          broken: brokenLinks
        }
        console.log("statsResult",statsResult);
        resolve(statsResult);
      }
    }).catch(err => {
      reject(new Error("Error en la promesa"))
    })
  })
}


//Recibe ruta y verfica si es un archivo o directorio
const mdlinks = (dirPath, options) => {
  return new Promise((resolve, rejects) => {
    if (options.validate === false && options.stats === false) {
      fileOrDir(dirPath)
        .then(resp => {
          resolve(resp)
        })
        .catch(err => {
          rejects(err)
        })
    } else if (options.validate === true && options.stats === false) {
      fileOrDir(dirPath).then(links => {
        toValidate(links).then(res => {
          resolve(res);
        })
      });
    } else if (options.validate === false && options.stats === true) {
      fileOrDir(dirPath).then(res => {
        statsOption(res).then(res => {
          resolve(res);
        });
      });
    } else if (options.validate === true && options.stats === true) {
      fileOrDir(dirPath).then(res => {
        statsToValidate(res)
          .then(res => {
            resolve(res);
          });
      });
    }

  });
};

module.exports = {mdlinks,fileOrDir,readFile,toValidate,statsOption,statsToValidate};
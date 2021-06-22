const { getLinks, mdlinks, fileOrDir } = require("../index");
const { links, dirPath, wrongDirPath, options } = require("../data");

describe('Testing mdLinks()', () => {
    it('should return something', () => {
        expect.assertions(1);
        return mdlinks(dirPath, options).then(res => {
          // console.log("respuesta", res);
            expect(res).toEqual(links);
        })
    })

    it('Deberia retornar un error', () => {
        expect.assertions(1);

        return mdlinks(wrongDirPath, options).catch(err => {
            expect(err).toStrictEqual(new Error('No es una ruta valida'));
        })
    })
})

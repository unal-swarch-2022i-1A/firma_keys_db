const KeysDao = require('./KeysDao.js');
const { generateKeyPairSync } = require('crypto');

async function generateKeys(id) {
    var { publicKey, privateKey } = generateKeyPairSync('rsa', {
        modulusLength: 1024,  // the length of your key in bits
        publicKeyEncoding: {
            type: 'spki',       // recommended to be 'spki' by the Node.js docs
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',      // recommended to be 'pkcs8' by the Node.js docs
            format: 'pem'
        }
    });

    var keysDao = new KeysDao();
    //var privateKey = '-----BEGIN RSA PRIVATE KEY-----\r\nMIICWwIBAAKBgQDAZSfzwxio51ITASN7m7Ck5GMA8gUpSPHKOn6lYQ17ZqGO6YWq\r\njOzYNL/ipxVWq8Ztr1zueOpIFSnKxf7XG1u/FIdkUlufpRcUSahrXxbUJX36+Qqk\r\nujRvC1XwZTRmhoqiLaO8wHxFMXqJrhgAvr5+Yjtpftph731rgN77XLAgCQIDAQAB\r\nAoGAPNbAD4E+JwsfFQtjIQ9WiI4AEKh3oVqDuyNMMRfDn6YQqJSHxCrUKnpjw1R6\r\nlvGyybSOeoqZ6zlmAc0ijPsFw5XVET1U1PR52RgPTBJJB+pYkGW5LJCtT/lkARE/\r\nNoqqkAgRhWBxl5mSyQWHfjsDtcoebdYpMmQbn0NkKHWzaRECQQDzGpIAZZO093GY\r\nD3JaxXdKGnvvRKXn6+cY/FXErtRRVzfIiGUD4fGSP013wdWpgCdHv2ZR5ARv7udo\r\nE91PDiwnAkEAypnyD99jVJdwRUh65k/BHseefCQlJEhslr3g7INNAj5/9IdWhs6B\r\nI98NEeoCiOQ0PvKAU8Mebu38hj8jEfuATwJAaGIERr9WyOFmmRAo3ejj66GrjXVA\r\nd3DHbecLPMSEzdhRT32hQiWGAHHF5aIJCBrKwvfgC1GIxjcijYHaCNPhCQJAGSOp\r\nCZcqeCCiabZoqZNT30HdxIGnqizibIH7Gt3f/FtM/Uad0fRlydGviX2D+wB2CymE\r\nCuC3MgSNxQqoi16tuQJABfEHYSJ5PAt4BbPZ1jXEbjWtN4bHpcuVQE/Sa0AbzRdP\r\n77nK0sDR02StrgmEozg/Rr3bxfaMYAgaQBvz/zgrtg==\r\n-----END RSA PRIVATE KEY-----';
    //var publicKey = '-----BEGIN PUBLIC KEY-----\r\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDAZSfzwxio51ITASN7m7Ck5GMA\r\n8gUpSPHKOn6lYQ17ZqGO6YWqjOzYNL/ipxVWq8Ztr1zueOpIFSnKxf7XG1u/FIdk\r\nUlufpRcUSahrXxbUJX36+QqkujRvC1XwZTRmhoqiLaO8wHxFMXqJrhgAvr5+Yjtp\r\nftph731rgN77XLAgCQIDAQAB\r\n-----END PUBLIC KEY-----';
    let response = await keysDao.insertData(id, privateKey, publicKey);
    return response;
}

async function getPublicKey(id) {
    var keysDao = new KeysDao();
    let key = await keysDao.fetchData(id, ["public"]);
    //console.log("id",id,"key",key);
    return key.public;
}

async function getPrivateKey(id) {
    var keysDao = new KeysDao();
    let key = await keysDao.fetchData(id, ["private"]);
    //console.log("id",id,"key",key);
    return key.private;

}

module.exports = {
    getPublicKey: getPublicKey,
    getPrivateKey: getPrivateKey,
    generateKeys: generateKeys
}


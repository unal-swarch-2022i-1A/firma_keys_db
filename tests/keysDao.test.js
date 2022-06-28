const KeysDao = require('../src/keysDao');

describe('KeysDao', () => {

    var userId = Math.floor(Math.random() * 100);
    console.log("userId: ",userId);
    jest.setTimeout(10000);

    it('select', () => {
        var keysDao = new KeysDao();
        return keysDao.select(1).then(data => {
            console.log(data)
            expect(data).not.toBeNull();
        });
    });

    it('insert', () => {
        var keysDao = new KeysDao();        
        //var privateKey = "-----BEGIN RSA PRIVATE KEY-----\r\nMIICWwIBAAKBgQDAZSfzwxio51ITASN7m7Ck5GMA8gUpSPHKOn6lYQ17ZqGO6YWq\r\njOzYNL/ipxVWq8Ztr1zueOpIFSnKxf7XG1u/FIdkUlufpRcUSahrXxbUJX36+Qqk\r\nujRvC1XwZTRmhoqiLaO8wHxFMXqJrhgAvr5+Yjtpftph731rgN77XLAgCQIDAQAB\r\nAoGAPNbAD4E+JwsfFQtjIQ9WiI4AEKh3oVqDuyNMMRfDn6YQqJSHxCrUKnpjw1R6\r\nlvGyybSOeoqZ6zlmAc0ijPsFw5XVET1U1PR52RgPTBJJB+pYkGW5LJCtT/lkARE/\r\nNoqqkAgRhWBxl5mSyQWHfjsDtcoebdYpMmQbn0NkKHWzaRECQQDzGpIAZZO093GY\r\nD3JaxXdKGnvvRKXn6+cY/FXErtRRVzfIiGUD4fGSP013wdWpgCdHv2ZR5ARv7udo\r\nE91PDiwnAkEAypnyD99jVJdwRUh65k/BHseefCQlJEhslr3g7INNAj5/9IdWhs6B\r\nI98NEeoCiOQ0PvKAU8Mebu38hj8jEfuATwJAaGIERr9WyOFmmRAo3ejj66GrjXVA\r\nd3DHbecLPMSEzdhRT32hQiWGAHHF5aIJCBrKwvfgC1GIxjcijYHaCNPhCQJAGSOp\r\nCZcqeCCiabZoqZNT30HdxIGnqizibIH7Gt3f/FtM/Uad0fRlydGviX2D+wB2CymE\r\nCuC3MgSNxQqoi16tuQJABfEHYSJ5PAt4BbPZ1jXEbjWtN4bHpcuVQE/Sa0AbzRdP\r\n77nK0sDR02StrgmEozg/Rr3bxfaMYAgaQBvz/zgrtg==\r\n-----END RSA PRIVATE KEY-----";
        //var publicKey = "----BEGIN PUBLIC KEY-----\r\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDAZSfzwxio51ITASN7m7Ck5GMA\r\n8gUpSPHKOn6lYQ17ZqGO6YWqjOzYNL/ipxVWq8Ztr1zueOpIFSnKxf7XG1u/FIdk\r\nUlufpRcUSahrXxbUJX36+QqkujRvC1XwZTRmhoqiLaO8wHxFMXqJrhgAvr5+Yjtp\r\nftph731rgN77XLAgCQIDAQAB\r\n-----END PUBLIC KEY-----";
        var privateKey = "privateKey";
        var publicKey = "publicKey";
        return keysDao.insert(userId, privateKey, publicKey).then(data => {
            console.log(data)
            expect(data).not.toBeNull();
        });
    });

    it('update', () => {
        var keysDao = new KeysDao();
        //var privateKey = "-----BEGIN RSA PRIVATE KEY-----\r\nMIICWwIBAAKBgQDAZSfzwxio51ITASN7m7Ck5GMA8gUpSPHKOn6lYQ17ZqGO6YWq\r\njOzYNL/ipxVWq8Ztr1zueOpIFSnKxf7XG1u/FIdkUlufpRcUSahrXxbUJX36+Qqk\r\nujRvC1XwZTRmhoqiLaO8wHxFMXqJrhgAvr5+Yjtpftph731rgN77XLAgCQIDAQAB\r\nAoGAPNbAD4E+JwsfFQtjIQ9WiI4AEKh3oVqDuyNMMRfDn6YQqJSHxCrUKnpjw1R6\r\nlvGyybSOeoqZ6zlmAc0ijPsFw5XVET1U1PR52RgPTBJJB+pYkGW5LJCtT/lkARE/\r\nNoqqkAgRhWBxl5mSyQWHfjsDtcoebdYpMmQbn0NkKHWzaRECQQDzGpIAZZO093GY\r\nD3JaxXdKGnvvRKXn6+cY/FXErtRRVzfIiGUD4fGSP013wdWpgCdHv2ZR5ARv7udo\r\nE91PDiwnAkEAypnyD99jVJdwRUh65k/BHseefCQlJEhslr3g7INNAj5/9IdWhs6B\r\nI98NEeoCiOQ0PvKAU8Mebu38hj8jEfuATwJAaGIERr9WyOFmmRAo3ejj66GrjXVA\r\nd3DHbecLPMSEzdhRT32hQiWGAHHF5aIJCBrKwvfgC1GIxjcijYHaCNPhCQJAGSOp\r\nCZcqeCCiabZoqZNT30HdxIGnqizibIH7Gt3f/FtM/Uad0fRlydGviX2D+wB2CymE\r\nCuC3MgSNxQqoi16tuQJABfEHYSJ5PAt4BbPZ1jXEbjWtN4bHpcuVQE/Sa0AbzRdP\r\n77nK0sDR02StrgmEozg/Rr3bxfaMYAgaQBvz/zgrtg==\r\n-----END RSA PRIVATE KEY-----";
        //var publicKey = "----BEGIN PUBLIC KEY-----\r\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDAZSfzwxio51ITASN7m7Ck5GMA\r\n8gUpSPHKOn6lYQ17ZqGO6YWqjOzYNL/ipxVWq8Ztr1zueOpIFSnKxf7XG1u/FIdk\r\nUlufpRcUSahrXxbUJX36+QqkujRvC1XwZTRmhoqiLaO8wHxFMXqJrhgAvr5+Yjtp\r\nftph731rgN77XLAgCQIDAQAB\r\n-----END PUBLIC KEY-----";
        var privateKey = "privateKey";
        var publicKey = "publicKey";
        return keysDao.update(userId, privateKey, publicKey).then(data => {
            //console.log(data)
            expect(data).not.toBeNull();
        });
    });    


    it('delete', () => {
        var keysDao = new KeysDao();
        return keysDao.delete(userId).then(data => {
            //console.log(data)
            expect(data).not.toBeNull();
        });
    });      

});
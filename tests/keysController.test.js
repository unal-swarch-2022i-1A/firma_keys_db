const controller = require('../src/keysController');

describe('Controller', () => {
    var userId = Math.floor(Math.random() * 100);
    it('generateKeys', () => {
        return controller.generateKeys(userId).then(data => {
            console.log(userId,data)
            expect(data).not.toBeNull();
        });
    });

    it('generateKeys duplicated', () => {
        return controller.generateKeys(userId).then(data => {
            console.log(userId,data)
            expect(data).not.toBeNull();
        });
    });

    it('getPublicKey', () => {
        return controller.getPublicKey(userId).then(data => {
            console.log(userId,data)
            expect(data).not.toBeNull();
        });
    });

    it('getPrivateKey', () => {
        return controller.getPrivateKey(userId).then(data => {
            console.log(userId,data)
            expect(data).not.toBeNull();
        });
    });
});
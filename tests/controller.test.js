const controller = require('../src/controller');

test('call getPublicKey(30)', () => {
    expect(controller.getPublicKey(30)).not.toBeNull();
});
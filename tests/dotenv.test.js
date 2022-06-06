require('dotenv').config()

test('Variables de entorno', () => {
    expect(process.env.RABBITMQ_DEFAULT_USER).not.toBeNull();
    expect(process.env.RABBITMQ_DEFAULT_PASS).not.toBeNull();
});
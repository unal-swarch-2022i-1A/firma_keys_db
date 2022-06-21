#!/usr/bin/env node

console.log('Launching RPC server');

// Modulos NodeJS
require('dotenv').config()
const amqp = require('amqplib/callback_api');
const controller = require('./keysController');

// Argumentos de llamada
var args = process.argv.slice(2);

// Validación de argumentos
if (
        args.length == 0 || 
        (!args.includes("public") && !args.includes("private") && !args.includes("generate"))
    ) {
    console.log("Usage: keys_ms.js [generate] [public] [private]");
    process.exit(1);
}

var queueName = args.join('_');

console.log("Variable de entorno $RABBITMQ_HOST =",process.env.RABBITMQ_HOST);

const ampqpOptions = {
    protocol: 'amqp',
    hostname: process.env.RABBITMQ_HOST,
    port: process.env.RABBITMQ_PORT,
    username: process.env.RABBITMQ_DEFAULT_USER,
    password: process.env.RABBITMQ_DEFAULT_PASS,
    locale: 'en_US',
    frameMax: 0,
    heartbeat: 0,
    vhost: '/',
}

/**
 * > Connect to an AMQP 0-9-1 server, optionally given an AMQP URL (see AMQP URI syntax) and socket options. The 
 * > protocol part (amqp: or amqps:) is mandatory; defaults for elided parts are as given in 
 * > 'amqp://guest:guest@localhost:5672'. If the URI is omitted entirely, it will default to 'amqp://localhost', 
 * > which given the defaults for missing parts, will connect to a RabbitMQ installation with factory settings, 
 * > on localhost.
 * https://amqp-node.github.io/amqplib/channel_api.html#connect
 */
amqp.connect(ampqpOptions, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    /**
     * cRear canal de comunicación
     * > Resolves to an open Channel (The callback version returns the channel; but it is not usable before the 
     * > callback has been invoked). May fail if there are no more channels available (i.e., if there are 
     * > already channelMax channels open).
     */
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        //#Region nuevo
        /**
         * Crear el exchange
         * > Assert an exchange into existence. As with queues, if the exchange exists already and has properties 
         * > different to those supplied, the channel will ‘splode; fields in the arguments object may or may not 
         * > be ‘splodey, depending on the type of exchange. Unlike queues, you must supply a name, and it can’t 
         * > be the empty string. You must also supply an exchange type, which determines how messages will be 
         * > routed through the exchange.
         * https://amqp-node.github.io/amqplib/channel_api.html#channel_assertExchange
         */
        var exchangeName = 'keys_ms_call_exchange';
        channel.assertExchange(exchangeName, 'direct', {
            durable: false
        });

        /**
         * Crear la cola
         * @param {*} nombre if you supply an empty string or other falsey value (including null and undefined), the server will create a random name for you.
         * @param {*} opciones exclusive: if true, scopes the queue to the connection (defaults to false)
         * @param {*} callback(err,ok) 
         * > Assert a queue into existence. This operation is idempotent given identical arguments; however, it 
         * > will bork the channel if the queue already exists but has different properties (values supplied in 
         * > the arguments field may or may not count for borking purposes; check the borker’s, I mean broker’s, 
         * > documentation).
         * 
         * * exclusive: if true, scopes the queue to the connection (defaults to false)
         * 
         * > Resolves to the “ok” reply from the server, which includes fields for the queue name (important if 
         * > you let the server name it), a recent consumer count, and a recent message count; e.g.,
         * 
         * https://amqp-node.github.io/amqplib/channel_api.html#channel_assertQueue
         */
        channel.assertQueue(
            `keys_ms_${queueName}_request_queue`,
            { exclusive: true },
            function (error2, assertedQueue) {
                if (error2) {
                    throw error2;
                }
                /**
                 * > Set the prefetch count for this channel. The count given is the maximum number of messages 
                 * > sent over the channel that can be awaiting acknowledgement; once there are count messages 
                 * > outstanding, the server will not send more messages on this channel until one or more have 
                 * > been acknowledged. A falsey value for count indicates no such limit
                 * https://amqp-node.github.io/amqplib/channel_api.html#channel_prefetch
                 */
                channel.prefetch(1);

                console.log(' [*] Consumiento cola de peticiones `%s` asociadas a exchange `%s` con ruteo `%s`', assertedQueue.queue, exchangeName, args);

                /**
                 * Enlaza una cola a cada uno de los argumentos de procedimiento al exchange
                 */
                args.forEach(function (procedure) {
                    /**
                     * > Assert a routing path from an exchange to a queue: the exchange named by source will relay 
                     * > messages to the queue named, according to the type of the exchange and the pattern given. 
                     * > The RabbitMQ tutorials give a good account of how routing works in AMQP.
                     * https://amqp-node.github.io/amqplib/channel_api.html#channel_bindQueue
                     */
                    console.log(` [*] Enlazando la cola '${assertedQueue.queue}' con el exchange '${exchangeName}' con la llave '${procedure}'`)
                    channel.bindQueue(assertedQueue.queue, exchangeName, procedure);
                });

                /**
                 * Consume los mensajes de la cola
                 * > Set up a consumer with a callback to be invoked with each message.
                 * > * noAck (boolean): if true, the broker won’t expect an acknowledgement of messages delivered to 
                 * > this consumer; i.e., it will dequeue messages as soon as they’ve been sent down the wire. 
                 * > Defaults to false (i.e., you will be expected to acknowledge messages).
                 * https://amqp-node.github.io/amqplib/channel_api.html#channel_consume
                 */
                channel.consume(assertedQueue.queue, async function (msg) {
                    let n = parseInt(msg.content.toString());
                    var _return;
                    switch (msg.fields.routingKey) {
                        case 'generate':
                            _return = await controller.generateKeys(n);           
                            break;
                        case 'public':
                            _return = await controller.getPublicKey(n);                                
                            break;
                        case 'private':
                            _return = await controller.getPrivateKey(n);                
                            break;
                        default:
                            console.log(`Sorry, we are out of ${msg.fields.routingKey}.`);
                    }

                    console.log(" [x] Procedimiento: %s, Parámetro: %s, Cola de respuesta: %s", msg.fields.routingKey, msg.content.toString(), msg.properties.replyTo);

                    channel.sendToQueue(msg.properties.replyTo,
                        Buffer.from(_return.toString()), {
                        correlationId: msg.properties.correlationId
                    });

                    channel.ack(msg);

                });
            });
    });
});
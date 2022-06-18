#!/usr/bin/env node

// Modulos NodeJS
require('dotenv').config()
var amqp = require('amqplib/callback_api');
const controller = require('./controller');

// Argumentos de llamada
var args = process.argv.slice(2);

// Validación de argumentos
if (args.length == 0 || (!args.includes("public") && !args.includes("private") )) {
    console.log("Usage: keys_ms.js [public] [private]");
    process.exit(1);
}

// Servidor en conexión
amqp.connect(process.env.RABBITMQ_CONN, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    // Canal de comunicación
    /**
     * Resolves to an open Channel (The callback version returns the channel; but it is not usable before the 
     * callback has been invoked). May fail if there are no more channels available (i.e., if there are 
     * already channelMax channels open).
     */
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        
        /**
         * Assert an exchange into existence. As with queues, if the exchange exists already and has properties 
         * different to those supplied, the channel will ‘splode; fields in the arguments object may or may not 
         * be ‘splodey, depending on the type of exchange. Unlike queues, you must supply a name, and it can’t 
         * be the empty string. You must also supply an exchange type, which determines how messages will be 
         * routed through the exchange.
         * https://amqp-node.github.io/amqplib/channel_api.html#channel_assertExchange
         */
        var exchange = 'direct_logs';
        channel.assertExchange(exchange, 'direct', {
            durable: false
        });

        /**
         * Assert a queue into existence. This operation is idempotent given identical arguments; however, it 
         * will bork the channel if the queue already exists but has different properties (values supplied in 
         * the arguments field may or may not count for borking purposes; check the borker’s, I mean broker’s, 
         * documentation).
         * 
         * * exclusive: if true, scopes the queue to the connection (defaults to false)
         * 
         * Resolves to the “ok” reply from the server, which includes fields for the queue name (important if 
         * you let the server name it), a recent consumer count, and a recent message count; e.g.,
         * 
         * https://amqp-node.github.io/amqplib/channel_api.html#channel_assertQueue
         */
        channel.assertQueue('', {
            exclusive: true
        }, function (error2, reply) {
            if (error2) {
                throw error2;
            }
            console.log(' [*] Esperando mensajes para',args);

            args.forEach(function (severity) {
                /**
                 * Assert a routing path from an exchange to a queue: the exchange named by source will relay 
                 * messages to the queue named, according to the type of the exchange and the pattern given. 
                 * The RabbitMQ tutorials give a good account of how routing works in AMQP.
                 * https://amqp-node.github.io/amqplib/channel_api.html#channel_bindQueue
                 */
                channel.bindQueue(reply.queue, exchange, severity);
            });

            /**
             * Set up a consumer with a callback to be invoked with each message.
             * * noAck (boolean): if true, the broker won’t expect an acknowledgement of messages delivered to 
             * this consumer; i.e., it will dequeue messages as soon as they’ve been sent down the wire. 
             * Defaults to false (i.e., you will be expected to acknowledge messages).
             * https://amqp-node.github.io/amqplib/channel_api.html#channel_consume
             */
            channel.consume(reply.queue, function (msg) {
                let n = parseInt(msg.content.toString());
                switch (msg.fields.routingKey) {
                    case 'public':
                        var r = controller.getPublicKey(n);
                        console.log(" [o] %s: '%s'", msg.fields.routingKey, msg.content.toString(),r);
                        
                        break;
                    case 'private':
                        var r = controller.getPrivateKey(n);                    
                        console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString(),r);                        
                        break;
                    default:
                        console.log(`Sorry, we are out of ${msg.fields.routingKey}.`);
                }            
            }, {
                noAck: true
            });
        });
    });
});

#!/usr/bin/env node

// Modulos NodeJS
require('dotenv').config()
var amqp = require('amqplib/callback_api');
const controller = require('./controller');

amqp.connect(process.env.RABBITMQ_CONN, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'rpc_queue';

        channel.assertQueue(queue, {
            durable: false
        });
        channel.prefetch(1);
        console.log(' [x] Awaiting RPC requests');
        channel.consume(queue, function reply(msg) {
            var n = parseInt(msg.content.toString());

            console.log(" [.] getPublicKey(%d)", n);

            var r = controller.getPublicKey(n);

            channel.sendToQueue(msg.properties.replyTo,
                Buffer.from(r.toString()), {
                    correlationId: msg.properties.correlationId
                });

            channel.ack(msg);
        });
    });
});
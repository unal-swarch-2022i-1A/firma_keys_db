#!/usr/bin/env node
require('dotenv').config()
var amqp = require('amqplib/callback_api');

amqp.connect(process.env.RABBITMQ_CONN, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'direct_logs';
    var args = process.argv.slice(2);
    var msg = args.slice(1).join(' ') || '1!';
    var num = parseInt(msg);
    var severity = (args.length > 0) ? args[0] : 'private';
    var correlationId = generateUuid();

    channel.assertExchange(exchange, 'direct', {
      durable: false
    });

    //respuseta
    channel.assertQueue('', {
      exclusive: true
    }, function (error2, q) {
      if (error2) {
        throw error2;
      }
      console.log(' [*] Waiting for logs. To exit press CTRL+C', q);

      args.forEach(function (severity) {
        channel.bindQueue(q.queue, exchange, severity);
      });

      channel.consume(q.queue, function (msg) {
        console.log(" [!] %s: '%s'", msg.fields.routingKey, msg.content.toString());
        if (msg.properties.correlationId === correlationId) {
          console.log(' [.] Got %s', msg.content.toString());
          setTimeout(function () {
            connection.close();
            process.exit(0);
          }, 500);
        }
      }, {
        noAck: true
      });
      
      //peticion
      channel.publish(exchange, severity, Buffer.from(num.toString()), {
        correlationId: correlationId,
        replyTo: q.queue
      });

    });


    console.log(" [x] Sent %s: '%s'", severity, msg);
  });

  setTimeout(function () {
    connection.close();
    process.exit(0)
  }, 500);
});

function generateUuid() {
  return Math.random().toString() +
    Math.random().toString() +
    Math.random().toString();
}

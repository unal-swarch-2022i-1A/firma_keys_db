#!/usr/bin/env node
/**
 * Este archivo solo tiene un proposito didáctico puesto el servicio de Keys debe ser consumido por un cliente en otro micro-servicio
 * 
 */
require('dotenv').config()
var amqp = require('amqplib/callback_api');

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
 * Creamos una conexión al servidor AMQP
 * 
 * > Connect to an AMQP 0-9-1 server, optionally given an AMQP URL (see AMQP URI syntax) and socket options. 
 * > The protocol part (amqp: or amqps:) is mandatory; defaults for elided parts are as given in 
 * > 'amqp://guest:guest@localhost:5672'. If the URI is omitted entirely, it will default to 'amqp://localhost', 
 * > which given the defaults for missing parts, will connect to a RabbitMQ installation with factory settings, 
 * > on localhost.
 */
amqp.connect(ampqpOptions, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  /**
   * Abre un canal del servidor AMQP 
   * @param callback(err, channel) {...}
   * > Resolves to an open Channel (The callback version returns the channel; but it is not usable before the 
   * > callback has been invoked). May fail if there are no more channels available (i.e., if there are already 
   * > channelMax channels open).
   * https://amqp-node.github.io/amqplib/channel_api.html#model_createChannel
   */
  connection.createChannel(
    /**
     * Callback de createChannel
     * Al abrir el canal se crear un `exchange`
     * @param {*} createChannelError error al intentar un canal
     * @param {*} channel canal abierto del servidor AMQP
     */
    function (createChannelError, channel) {
      // parametros
      var args = process.argv.slice(2);
      var msg = args.slice(1).join(' ') || '1!';
      var num = parseInt(msg);
      var procedure = (args.length > 0) ? args[0] : 'private';
      var correlationId = generateUuid();

      if (createChannelError) {
        throw createChannelError;
      }

      /**
       * > Exchanges are AMQP 0-9-1 entities where messages are sent to. Exchanges take a message and route it 
       * into zero or more queues. The routing algorithm used depends on the exchange type and rules called 
       * bindings.
       */
      var exchangeName = 'keys_ms_call_exchange';
      /**
       * Se declara un `exchange`
       * 
       * @param {*} nombre
       * @param {*} tipo
       * @param {*} opciones  
       * > Assert an exchange into existence. As with queues, if the exchange exists already and has properties 
       * > different to those supplied, the channel will ‘splode; fields in the arguments object may or may not 
       * > be ‘splodey, depending on the type of exchange. Unlike queues, you must supply a name, and it can’t 
       * > be the empty string. You must also supply an exchange type, which determines how messages will be 
       * > routed through the exchange.
       * 
       * > durable (boolean): if true, the exchange will survive broker restarts. Defaults to true.
       */
      channel.assertExchange(exchangeName, 'direct', {
        durable: true
      });

      /**
       * Declaramos un cola exlclusivamente para las respuestas del servidor a este cliente.
       * **Importante:** Neceistamos crear primero la cola de respuesta antes de publicar el la solicitud, porque en la solicitud 
       * indicamos cual es la cola donde se colocará las respuesta. Por eso primero se crear la cola de respuesta
       * y ahí si se publica la solicitud
       * 
       * @param {*} nombre if you supply an empty string or other falsey value (including null and undefined), the server will create a random name for you.
       * @param {*} opciones exclusive: if true, scopes the queue to the connection (defaults to false)
       * @param {*} callback(err,ok) 
       * 
       * > Assert a queue into existence. This operation is idempotent given identical arguments; however, it 
       * > will bork the channel if the queue already exists but has different properties (values supplied in the 
       * > arguments field may or may not count for borking purposes; check the borker’s, I mean broker’s, 
       * > documentation).
       * 
       * https://amqp-node.github.io/amqplib/channel_api.html#channel_assertQueue
       */
      channel.assertQueue(
        //'',
        'keys_ms_reply_queue.'+generateUuid(),
        { exclusive: false, durable: true },
        /**
         * callback de assertQueue
         * @param {*} assertQueueError 
         * @param {*} assertedReplyQueue Resolves to the “ok” reply from the server, which includes fields for the queue name (important if you let the server name it), a recent consumer count, and a recent message count
         */
        function (assertQueueError, assertedReplyQueue) {
          if (assertQueueError) {
            throw assertQueueError;
          }          


          console.log(" [x] Llamando keys.%s con %s. exchange: %s. Cola de respuesta: %s", procedure, msg, exchangeName, assertedReplyQueue.queue);

          // Respuesta
          /**
           * Consume la cola de respuestas del servidor a este proceso cliente
           * @param queue
           * @param callback
           * > Set up a consumer with a callback to be invoked with each message.
           */
           channel.consume(
            assertedReplyQueue.queue,
            /**
             * callback de consume
             * > The message callback supplied in the second argument will be invoked with message objects of this shape:
             * > { content: Buffer, fields: Object, properties: Object }
             * > The message content is a buffer containing the bytes published.
             * @param {*} reply 
             */
            function (reply) {
              console.log(' [.] Respuesta del servidor 1:\n', reply.content.toString());
              if (reply.properties.correlationId === correlationId) {
                console.log(' [.] Respuesta del servidor 2:\n', reply.content.toString());
                setTimeout(function () {
                  console.log(" [.] connection close 1")
                  connection.close();
                  process.exit(0);
                }, 1000);
              }
            }, {
            noAck: true
          });          

          // Peticion
          let options = {
            correlationId: correlationId,
            replyTo: assertedReplyQueue.queue
          }
          let content = Buffer.from(num.toString())
          /**
           * Peticion
           * Las opciones son:
           * > * correlationId (string): usually used to match replies to requests, or similar
           * > * replyTo (string): often used to name a queue to which the receiving application must send replies, 
           * >   in an RPC scenario (many libraries assume this pattern)
           * 
           * @param exchange
           * @param routingKey
           * @param content
           * @param options correlationId(string): usually used to match replies to requests, or similar , replyTo
           * > Publish a single message to an exchange.
           * 
           * https://amqp-node.github.io/amqplib/channel_api.html#channel_publish
           */
          channel.publish(exchangeName, procedure, content, options);

          

          /**
           * Enlazar cola con un exchange, y asociar un clave de relación
           * @param queue cola de respuesta
           * @param exchange exchange
           * @param pattern clave de la relación
           * > Assert a routing path from an exchange to a queue: the exchange named by source will relay messages
           * > to the queue named, according to the type of the exchange and the pattern given. The RabbitMQ 
           * > tutorials give a good account of how routing works in AMQP.
           * https://amqp-node.github.io/amqplib/channel_api.html#channel_bindQueue
           */
          channel.bindQueue(assertedReplyQueue.queue, exchangeName, procedure);

          console.log(' [*] Esperando respuesta...');

          console.log(' [.] Fin!');
        });


    });

  setTimeout(function () {
    console.log(" [.] connection close 2")
    connection.close();
    process.exit(0)
  }, 10000);
});

function generateUuid() {
  return Math.random().toString() +
    Math.random().toString() +
    Math.random().toString();
}

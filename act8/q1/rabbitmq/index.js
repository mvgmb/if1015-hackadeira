'use strict';

const amqp = require('amqplib/callback_api');

const queue = 'voltage';

amqp.connect('amqp://localhost', (err, connection) => {
  if (err) throw err;

  connection.createChannel((err1, channel) => {
    if (err1) throw err1;

    channel.assertQueue(queue, { durable: true });
    channel.prefetch(1);

    console.log('waiting for messages in queue %s...', queue);

    const onMessage = msg => {
      console.log('received: %s', msg.content.toString());
      channel.ack(msg);
    };

    channel.consume(queue, onMessage, { noAck: false });
  });
});

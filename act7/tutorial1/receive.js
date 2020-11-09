#!/usr/bin/env node

const amqp = require('amqplib/callback_api');

const queue = 'hello';

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    channel.assertQueue(queue, {
      durable: false,
    });

    console.log('[*] Waiting for messages in %s. To exit press CTRL+C', queue);

    const onMessage = msg => {
      console.log('[x] Received %s', msg.content.toString());
    };

    channel.consume(queue, onMessage, { noAck: true });
  });
});

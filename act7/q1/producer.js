#!/usr/bin/env node

'use strict';

const amqp = require('amqplib/callback_api');

const queue = 'test1';
const msg = process.argv[2];

amqp.connect('amqp://localhost', (err, connection) => {
  if (err) throw err;

  connection.createChannel((err1, channel) => {
    if (err1) throw err1;

    channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });

    console.log('sent: %s', msg);
  });

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
});

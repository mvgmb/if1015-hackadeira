#!/usr/bin/env node

'use strict';

// web socket publisher
const WebSocketServer = require('ws').Server;

const voltages = [];
const webSockets = [];

const broadcastMessage = msg => {
  for (const webSocket of webSockets)
    webSocket.send(JSON.stringify({ voltages: [msg] }));
};

const eventifyArrayPush = (arr, callback) => {
  arr.push = e => {
    Array.prototype.push.call(arr, e);
    callback(arr);
  };
};

eventifyArrayPush(voltages, updatedVoltages => {
  const i = updatedVoltages.length - 1;
  const msg = updatedVoltages[i];
  broadcastMessage(msg);
});

const wss = new WebSocketServer({ port: 8080, path: '/requests' });
wss.on('connection', ws => {
  console.log('new connection');

  webSockets.push(ws);
  ws.send(JSON.stringify({ voltages: voltages }));

  ws.on('close', (code, reason) => {
    console.log(`connection closed: ${code} - ${reason}`);
    const i = webSockets.indexOf(ws);
    if (i > -1) webSockets.splice(i, 1);
  });
});

// rabbitmq consumer
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
      voltages.push(msg.content.toString());
      channel.ack(msg);
    };

    channel.consume(queue, onMessage, { noAck: false });
  });
});

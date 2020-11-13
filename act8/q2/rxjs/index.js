'use strict';

const { webSocket } = require('rxjs/webSocket');
const ws = require('ws');
const { Subject } = require('rxjs');
const StartGrpcServer = require('./grpc');
const amqp = require('amqplib/callback_api');

const isUndesirableVoltage = voltage => 105 <= voltage <= 120;

const webSocketSubject = webSocket({
  url: 'ws://localhost:8081/randomVoltage',
  WebSocketCtor: ws,
});

const grpcSubject = new Subject();
StartGrpcServer(grpcSubject);

const queue = 'voltage';

amqp.connect('amqp://localhost', (err, connection) => {
  if (err) throw err;

  connection.createChannel((err1, channel) => {
    if (err1) throw err1;

    channel.assertQueue(queue, { durable: true });

    const next = msg => {
      if (isUndesirableVoltage(msg)) {
        console.log(`undesirable voltage ${msg}V`);
        channel.sendToQueue(queue, Buffer.from(`${msg}`), { persistent: true });
      }
    };

    const error = err => {
      const target =
        err.target._url === 'ws://localhost:8081/randomVoltage'
          ? 'websocket'
          : 'grpc';

      console.log(`${target} error: ${err.message}`);
    };

    const complete = () => {
      console.log('complete');
      connection.close();
      process.exit(0);
    };

    webSocketSubject.subscribe(next, error, complete);
    grpcSubject.subscribe(next, error, complete);
  });
});

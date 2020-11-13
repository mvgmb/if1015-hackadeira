'use strict';

const { clear } = require('console');

const WebSocketServer = require('ws').Server;

const randomInt = (low, high) => Math.floor(Math.random() * (high - low) + low);

const wss = new WebSocketServer({ port: 8081, path: '/randomVoltage' });
wss.on('connection', ws => {
  console.log('New connection');

  ws.on('message', message => {
    console.log(`message received: ${s}`, message);
  });

  const sendVoltage = () => {
    const voltage = randomInt(100, 130);
    console.log(`sending data: ${voltage}`);
    ws.send(voltage);
  };

  const intervalId = setInterval(sendVoltage, 2000);
  ws.on('close', (num, reason) => clear(intervalId));
});

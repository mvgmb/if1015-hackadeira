'use strict';

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

  setInterval(sendVoltage, 2000);
});

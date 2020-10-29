'use strict';

const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ port: 8080, path: '/testing' });
wss.on('connection', ws => {
  ws.on('message', message => {
    console.log('Msg received in server: %s ', message);
  });

  console.log('new connection');
  ws.send('Msg from server');
});

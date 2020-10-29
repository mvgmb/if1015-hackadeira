'use strict';

const WebSocketServer = require('ws').Server;

const webSockets = [];
const wss = new WebSocketServer({ port: 8080, path: '/testing' });

const broadcastMessage = (ws, msg) => {
  for (const webSocket of webSockets) {
    if (ws !== webSocket) webSocket.send(msg);
  }
};

wss.on('connection', ws => {
  console.log('new connection');

  webSockets.push(ws);
  ws.send('server: who is talking?');

  let user = '';
  ws.on('message', text => {
    let msg = `${user}: ${text}`;
    if (user === '') {
      user = text;
      console.log(`user '${user}' connected!`);

      msg = `server: ${user} joined the chat!`;
      ws.send(msg);
    }

    broadcastMessage(ws, msg);
  });

  ws.on('close', (code, reason) => {
    console.log(`user ${user} was disconnected: ${code} - ${reason}`);

    const i = webSockets.indexOf(ws);
    if (i > -1) webSockets.splice(i, 1);

    broadcastMessage(ws, `server: ${user} left the chat`);
  });
});

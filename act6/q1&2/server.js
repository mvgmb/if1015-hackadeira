'use strict';

const WebSocketServer = require('ws').Server;
const http = require('http');

const messages = [];
const webSockets = [];

const broadcastMessage = (ws, msg) => {
  messages.push(msg);

  for (const webSocket of webSockets) {
    if (ws !== webSocket) webSocket.send(msg);
  }
};

const wss = new WebSocketServer({ port: 8080, path: '/testing' });
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

// READ-ONLY chat

const eventifyArrayPush = (arr, callback) => {
  arr.push = e => {
    Array.prototype.push.call(arr, e);
    callback(arr);
  };
};

const requestListener = (req, res) => {
  res.writeHeader(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  for (const message of messages) {
    res.write(`${message}\n`);
  }

  eventifyArrayPush(messages, updatedMessages => {
    const i = updatedMessages.length - 1;
    const msg = updatedMessages[i];
    res.write(`${msg}\n`);
  });
};

const server = http.createServer(requestListener);
server.listen(9090);

console.log('SSE-Server listening at 9090');

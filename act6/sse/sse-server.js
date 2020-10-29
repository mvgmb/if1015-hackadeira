'use strict';

const http = require('http');

const randomInt = (low, high) => {
  return Math.floor(Math.random() * (high - low) + low);
};

const requestListener = (req, res) => {
  res.writeHeader(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });
  const interval = setInterval(() => {
    res.write('data: ' + randomInt(100, 127) + '\n\n');
  }, 2000);
};

const server = http.createServer(requestListener);
server.listen(9090);

console.log('SSE-Server listening at 9090');

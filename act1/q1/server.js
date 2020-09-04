const net = require('net');
const readline = require('readline');

const host = 'localhost';
const port = 1337;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const server = net.createServer(socket => {
  console.log('connected to ' + host + ':' + port);

  rl.addListener('line', line => {
    if (line === ':q') {
      socket.destroy();
    }

    socket.write(line);
    console.log('you > ' + line);
  });

  socket.on('data', data => {
    console.log('client > ' + data.toString());
  });

  socket.on('end', () => {
    console.log('disconnected from ' + host + ':' + port);
  });
});

server.listen(port, host);

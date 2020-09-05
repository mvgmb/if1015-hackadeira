const net = require('net');
const readline = require('readline');

const host = 'localhost';
const port = 1337;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const server = net.createServer(socket => {
  console.log('connected to client');
  rl.prompt(true);

  rl.addListener('line', line => {
    socket.write(line);
    rl.prompt(true);
  });

  socket.on('data', data => {
    readline.cursorTo(process.stdout, 0);
    console.log('client> ' + data.toString());
    rl.prompt(true);
  });

  socket.on('end', () => {
    console.log('disconnected from client');
    process.exit();
  });
});

server.listen(port, host);

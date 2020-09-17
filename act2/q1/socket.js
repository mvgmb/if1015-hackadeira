const readline = require('readline');
const udp = require('dgram');

const clientAddress = process.argv[2];
const clientPort = process.argv[3];
const serverAddress = process.argv[4];
const serverPort = process.argv[5];

if (!clientAddress || !clientPort || !serverAddress || !serverPort) {
  console.log(`undefined arguments
expected:
  node socket $client_addr $client_port $server_addr $server_port
actual
  node socket ${clientAddress} ${clientPort} ${serverAddress} ${serverPort}`);
  process.exit();
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const socket = udp.createSocket('udp4');

rl.addListener('line', line => {
  const data = Buffer.from(line);
  socket.send(data, serverPort, serverAddress, error => {
    if (error) {
      socket.close();
    }
    rl.prompt(true);
  });
});

socket.on('message', msg => {
  readline.cursorTo(process.stdout, 0);
  process.stdout.write('\r\x1b[K'); // clear current input line
  console.log('server> ' + msg.toString());
  rl.prompt(true);
});

socket.on('error', error => {
  console.log('Error: ' + error);
  socket.close();
});

socket.on('close', () => {
  console.log('disconnected from server');
  process.exit();
});

socket.bind(clientPort, clientAddress);
console.log(
  'client is listening at ' +
    clientAddress +
    ':' +
    clientPort +
    ' and is sending messages to ' +
    serverAddress +
    ':' +
    serverPort
);

rl.prompt(true);

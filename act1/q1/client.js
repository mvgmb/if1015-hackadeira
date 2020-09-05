const net = require('net');
const readline = require('readline');

const host = 'localhost';
const port = 1337;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client = new net.Socket();

client.connect(port, host, () => {
  console.log('connected to server');
  rl.prompt(true);

  rl.addListener('line', line => {
    client.write(line);
    rl.prompt(true);
  });
});

client.on('data', data => {
  readline.cursorTo(process.stdout, 0);
  console.log('server> ' + data.toString());
  rl.prompt(true);
});

client.on('close', () => {
  console.log('disconnected from server');
  process.exit();
});

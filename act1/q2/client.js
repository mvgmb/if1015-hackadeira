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
  console.log('connected to ' + host + ':' + port);

  rl.addListener('line', line => {
    client.write(line);
    rl.prompt(true);
  });
});

client.on('data', data => {
  readline.cursorTo(process.stdout, 0);
  console.log(data.toString());
  rl.prompt(true);
});

client.on('close', () => {
  console.log('>> server has closed <<');
  process.exit();
});

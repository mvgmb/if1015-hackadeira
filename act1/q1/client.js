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
    if (line === ':q') {
      client.destroy();
      console.log('>> chat ended <<');
      process.exit();
    }

    client.write(line);
    console.log('you > ' + line);
  });
});

client.on('data', data => {
  console.log('server > ' + data);
});

client.on('close', () => {
  console.log('>> chat ended <<');
  process.exit();
});

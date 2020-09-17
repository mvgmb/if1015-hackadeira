const net = require('net');

const host = 'localhost';
const port = 1337;

const val1 = process.argv[2];
const op = process.argv[3];
const val2 = process.argv[4];

if (!val1 || !op || !val2) {
  console.log(
    `expected 3 arguments, but got (val1, op, val2)): (${val1}, ${op}, ${val2})`
  );
  process.exit(1);
}

console.log(val1, op, val2);

const socket = new net.Socket();

socket.connect(port, host, () => {
  console.log('connected to server');
  socket.write(`${val1} ${op} ${val2}`);
});

socket.on('data', data => {
  console.log('= ' + data.toString());
  socket.destroy();
});

socket.on('close', () => {
  console.log('disconnected from server');
  process.exit();
});

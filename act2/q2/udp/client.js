const udp = require('dgram');

const serverAddress = 'localhost';
const serverPort = 2222;

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

const socket = udp.createSocket('udp4');

const data = Buffer.from(`${val1} ${op} ${val2}`);
socket.send(data, serverPort, serverAddress, error => {
  if (error) {
    socket.close();
  }
});

setTimeout(() => {
  console.log('timeout exceeded');
  process.exit(1);
}, 3000);

socket.on('message', msg => {
  console.log('= ' + msg.toString());
  process.exit();
});

socket.on('error', error => {
  console.log('error: ' + error);
  socket.close();
});

socket.on('close', () => {
  console.log('disconnected from calculator');
  process.exit();
});

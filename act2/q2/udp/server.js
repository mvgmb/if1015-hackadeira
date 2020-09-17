const udp = require('dgram');

const serverAddress = 'localhost';
const serverPort = 2222;
const validOperations = ['+', '-', '/', '*', '%'];

const calc = (val1, op, val2) => {
  const a = parseFloat(val1);
  if (isNaN(a)) {
    return `${val1} is not a number`;
  }

  const b = parseFloat(val2);
  if (isNaN(b)) {
    return `${val2} is not a number`;
  }

  if (!validOperations.includes(op)) {
    return `${op} is not a valid operation`;
  }

  const res = eval(`${a} ${op} ${b}`);
  console.log(`${a} ${op} ${b} = ${res}`);

  return res;
};

const socket = udp.createSocket('udp4');

socket.on('message', (msg, info) => {
  const [val1, op, val2] = msg.toString().split(' ');
  const res = calc(val1, op, val2);
  const data = Buffer.from(res.toString());
  socket.send(data, info.port, info.address, error => {
    if (error) {
      socket.close();
    }
  });
});

socket.on('error', error => {
  console.log(error);
  socket.close();
});

socket.on('close', () => {
  console.log('disconnected from server');
  process.exit();
});

socket.bind(serverPort, serverAddress);
console.log('listening at ' + serverAddress + ':' + serverPort);

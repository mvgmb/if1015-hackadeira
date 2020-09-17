const net = require('net');

const host = 'localhost';
const port = 1337;
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

const server = net.createServer(socket => {
  console.log('connected to client');

  socket.on('data', data => {
    const [val1, op, val2] = data.toString().split(' ');
    const res = calc(val1, op, val2);
    socket.write(res.toString());
  });

  socket.on('end', () => {
    console.log('disconnected from client');
  });
});

server.listen(port, host);

const net = require('net');

const host = 'localhost';
const port = 1337;

let socketUserMap = new Map();
const server = net.createServer(socket => {
  console.log('connected to new client');

  socket.write('please inform your user name');

  socket.on('data', data => {
    if (!socketUserMap.has(socket)) {
      const user = data.toString();
      socketUserMap.set(socket, user);
      console.log('user "' + user + '" logged in');

      socket.write('join the chat as ' + user);

      return;
    }

    const user = socketUserMap.get(socket);
    socketUserMap.forEach((_, socketValue) => {
      if (socketValue !== socket) {
        socketValue.write(user + '> ' + data);
      }
    });
  });

  socket.on('end', () => {
    console.log('user "' + socketUserMap.get(socket) + '" logged out');
    socketUserMap.delete(socket);
  });
});

server.listen(port, host);
console.log('started listening to ' + host + ':' + port);

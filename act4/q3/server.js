'use strict';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const SERVER_ADDRESS = 'localhost:5001';

const proto = grpc.loadPackageDefinition(
  protoLoader.loadSync('chat.proto', {})
);

const users = [];
let usersMap = new Map();

const join = (call, callback) => {
  users.push(call);
  call.write({
    user: 'server',
    text: `what's your usename?`,
  });

  call.on('data', message => {
    if (!usersMap.has(call)) {
      usersMap.set(call, message.user);

      console.log(`${message.user} entered the chat`);
      notifyChat({
        user: 'server',
        text: `${message.user} entered the chat!`,
      });

      return;
    }

    notifyChat(message);
  });

  call.on('end', () => {
    const userLeft = usersMap.get(call);
    usersMap.delete(call);
    console.log(`${userLeft} left the chat`);
    notifyChat({
      user: 'server',
      text: `${userLeft} left the chat. ${usersMap.size} user(s) online`,
    });
  });
};

const notifyChat = message => {
  usersMap.forEach((_, user) => {
    user.write(message);
  });
};

const server = new grpc.Server();
server.addService(proto.chatPackage.Chat.service, { join: join });
server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());
server.start();

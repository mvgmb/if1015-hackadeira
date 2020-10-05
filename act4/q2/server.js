'use strict';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const readline = require('readline');

const proto = grpc.loadPackageDefinition(
  protoLoader.loadSync('chat.proto', {})
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const SERVER_ADDRESS = 'localhost:5001';
const user = 'server';

const join = (call, callback) => {
  console.log('client entered chat! ');
  rl.prompt(true);

  rl.on('line', text => {
    call.write({ user: user, text: text }, res => {});
    rl.prompt(true);
  });

  call.on('data', msg => {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write('\r\x1b[K'); // clear current input line
    console.log(`${msg.user}> ${msg.text}`);
    rl.prompt(true);
  });

  call.on('end', () => {
    console.log(`client left the chat`);
    process.exit(0);
  });
};

const server = new grpc.Server();
server.addService(proto.chatPackage.Chat.service, { join: join });
server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());
server.start();

console.log(`listening at ${SERVER_ADDRESS}`);

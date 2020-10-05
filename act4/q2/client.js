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

const REMOTE_SERVER = 'localhost:5001';
const user = 'client';

const client = new proto.chatPackage.Chat(
  REMOTE_SERVER,
  grpc.credentials.createInsecure()
);

const channel = client.join({ user: user });

channel.on('data', msg => {
  readline.cursorTo(process.stdout, 0);
  process.stdout.write('\r\x1b[K'); // clear current input line
  console.log(`${msg.user}> ${msg.text}`);
  rl.prompt(true);
});

channel.on('error', err => {
  console.log('unable to reach server');
  process.exit(0);
});

rl.on('line', text => {
  channel.write({ user: user, text: text }, res => {});
  rl.prompt(true);
});

console.log('entered chat!');
rl.prompt(true);

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

const client = new proto.chatPackage.Chat(
  REMOTE_SERVER,
  grpc.credentials.createInsecure()
);

let user = '';
const channel = client.join({ user: user });

channel.on('data', msg => {
  if (msg.user == user) {
    return;
  }
  readline.cursorTo(process.stdout, 0);
  process.stdout.write('\r\x1b[K'); // clear current input line
  console.log(`${msg.user}> ${msg.text}`);
  rl.prompt(true);
});

rl.on('line', text => {
  if (user == '') {
    user = text;
  }
  channel.write({ user: user, text: text }, res => {});
  rl.prompt(true);
});

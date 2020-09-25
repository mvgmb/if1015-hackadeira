'use strict';

const udp = require('dgram');
const ServerCalculatorInvoker = require('./server_calculator_invoker');

const serverAddress = 'localhost';
const serverPort = 2222;

const socket = udp.createSocket('udp4');

ServerCalculatorInvoker.invoke(socket);

socket.bind(serverPort, serverAddress);
console.log('listening at ' + serverAddress + ':' + serverPort);

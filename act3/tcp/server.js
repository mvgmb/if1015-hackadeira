'use strict';

const net = require('net');
const ServerCalculatorInvoker = require('./server_calculator_invoker');

const host = 'localhost';
const port = 1337;

const server = net.createServer(ServerCalculatorInvoker.invoke);
server.listen(port, host);

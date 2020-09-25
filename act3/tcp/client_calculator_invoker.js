'use strict';

const net = require('net');
const CalculatorMarshaller = require('../protocol/marshaller');
const CalculatorUnmarshaller = require('../protocol/unmarshaller');

const host = 'localhost';
const port = 1337;

const ClientCalculatorInvoker = {
  invoke: (methodName, ...args) => {
    return new Promise(resolve => {
      let bytes;
      switch (methodName) {
        case 'calculate':
          bytes = CalculatorMarshaller.marshalCalculateRequest(...args);
          break;

        default:
          throw `unsupported method ${methodName}`;
      }

      const socket = new net.Socket();
      socket.connect(port, host, () => {
        console.log('connected to server');
        socket.write(bytes);
      });

      socket.on('data', data => {
        socket.destroy();
        resolve(CalculatorUnmarshaller.unmarshalResponse(data));
      });

      socket.on('close', () => {
        console.log('disconnected from server');
      });

      socket.on('error', err => {
        throw err;
      });
    });
  },
};

module.exports = ClientCalculatorInvoker;

'use strict';

const udp = require('dgram');
const CalculatorMarshaller = require('../protocol/marshaller');
const CalculatorUnmarshaller = require('../protocol/unmarshaller');

const serverAddress = 'localhost';
const serverPort = 2222;

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

      const socket = udp.createSocket('udp4');
      socket.send(bytes, serverPort, serverAddress, error => {
        if (error) {
          socket.close();
        }
      });

      setTimeout(() => {
        throw 'timeout exceeded';
      }, 3000);

      socket.on('message', msg => {
        resolve(CalculatorUnmarshaller.unmarshalResponse(msg));
      });

      socket.on('error', err => {
        throw err;
      });

      socket.on('close', () => {
        throw 'disconnected from calculator';
      });
    });
  },
};

module.exports = ClientCalculatorInvoker;

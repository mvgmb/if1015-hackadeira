'use strict';

const ServerInvocationHandler = require('./server_invocation_handler');
const CalculatorMarshaller = require('../protocol/marshaller');
const CalculatorUnmarshaller = require('../protocol/unmarshaller');

const ServerCalculatorInvoker = {
  invoke: socket => {
    socket.on('message', (msg, info) => {
      const req = CalculatorUnmarshaller.unmarshalRequest(msg);

      let res;
      try {
        const result = ServerInvocationHandler.handle(req);
        res = CalculatorMarshaller.marshalCalculateResponse(result);
      } catch (err) {
        console.log('error:', err);
        res = CalculatorMarshaller.marshalError(err);
      }

      const data = Buffer.from(res);
      socket.send(data, info.port, info.address, error => {
        if (error) {
          socket.close();
        }
      });
    });

    socket.on('error', error => {
      console.log(error);
      socket.close();
    });

    socket.on('close', () => {
      console.log('disconnected from server');
    });
  },
};

module.exports = ServerCalculatorInvoker;

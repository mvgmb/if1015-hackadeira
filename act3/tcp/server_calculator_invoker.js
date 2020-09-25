'use strict';

const ServerInvocationHandler = require('./server_invocation_handler');
const CalculatorMarshaller = require('../protocol/marshaller');
const CalculatorUnmarshaller = require('../protocol/unmarshaller');

const ServerCalculatorInvoker = {
  invoke: socket => {
    console.log('connected to client');

    socket.on('data', data => {
      const req = CalculatorUnmarshaller.unmarshalRequest(data);

      let res;
      try {
        const result = ServerInvocationHandler.handle(req);
        res = CalculatorMarshaller.marshalCalculateResponse(result);
      } catch (err) {
        console.log('error:', err);
        res = CalculatorMarshaller.marshalError(err);
      }

      socket.write(res);
    });

    socket.on('end', () => {
      console.log('disconnected from client');
    });
  },
};

module.exports = ServerCalculatorInvoker;

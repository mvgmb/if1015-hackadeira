'use strict';

const Calculator = require('../calculator');

const ServerInvocationHandler = {
  handle: req => {
    const { method, args } = req;
    switch (method) {
      case 'calculate':
        const result = Calculator.calculate(args.operation, args.a, args.b);
        console.log(`${args.a} ${args.operation} ${args.b} = ${result}`);
        return result;

      default:
        throw `unsupported method ${method}`;
    }
  },
};

module.exports = ServerInvocationHandler;

'use strict';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const Calculator = require('./calculator');

const packageDef = protoLoader.loadSync('calculator.proto', {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const calculatorPackage = grpcObject.calculatorPackage;

const host = 'localhost';
const port = '40000';

const server = new grpc.Server();
server.bind(`${host}:${port}`, grpc.ServerCredentials.createInsecure());

server.addService(calculatorPackage.Calculator.service, {
  calculate: (call, callback) => {
    const { operation, a, b } = call.request;
    console.log(a, operation, b);

    let response = {};
    try {
      response = {
        status: {
          code: 200,
          message: 'OK',
        },
        result: Calculator.calculate(operation, a, b),
      };
    } catch (err) {
      response = {
        status: {
          code: 400,
          message: err,
        },
      };
    }

    callback(null, response);
  },
});

server.start();

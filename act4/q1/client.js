'use strict';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDef = protoLoader.loadSync('calculator.proto', {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const calculatorPackage = grpcObject.calculatorPackage;

const host = 'localhost';
const port = '40000';

const val1 = process.argv[2];
const op = process.argv[3];
const val2 = process.argv[4];

if (!val1 || !op || !val2) {
  console.log(
    `expected 3 arguments, but got (val1, op, val2)): (${val1}, ${op}, ${val2})`
  );
  process.exit(1);
}

const client = new calculatorPackage.Calculator(
  `${host}:${port}`,
  grpc.credentials.createInsecure()
);

const calculateRequest = {
  operation: op,
  a: val1,
  b: val2,
};

client.calculate(calculateRequest, (err, res) => {
  if (err) {
    console.log(err);
  } else {
    if (res.status.code != 200) {
      console.log(res.status.message);
    } else {
      console.log('=', res.result);
    }
  }
});

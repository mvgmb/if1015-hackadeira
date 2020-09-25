'use strict';

const ClientCalculatorInvoker = require('./client_calculator_invoker');

const val1 = process.argv[2];
const op = process.argv[3];
const val2 = process.argv[4];

if (!val1 || !op || !val2) {
  console.log(
    `expected 3 arguments, but got (val1, op, val2)): (${val1}, ${op}, ${val2})`
  );
  process.exit(1);
}

ClientCalculatorInvoker.invoke('calculate', op, val1, val2)
  .then(res => {
    if (res.err) {
      console.log('err:', res.err.toString());
    } else {
      console.log('result:', res.result.toString());
    }
  })
  .catch(err => console.log('err: ', err));

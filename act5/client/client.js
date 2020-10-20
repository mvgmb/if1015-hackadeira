'use strict';

const http = require('http');
const fs = require('fs');

const method = process.argv[2];
const contentType = process.argv[3];
const accept = process.argv[4];
const path = process.argv[5];
const filePath = process.argv[6];

if (!method || !contentType || !accept | !path) {
  console.log(`expected: (method, contentType, accept, path)
actual: (${method}, ${contentType}, ${accept}, ${path})`);
  process.exit(1);
}

const requestCallback = res => {
  console.log(
    `statusCode: ${res['statusCode']}, statusMessage: ${res['statusMessage']}`
  );

  let str = '';
  res.on('data', chunk => (str += chunk));
  res.on('end', () => (str ? console.log(str) : ''));
};

let body = '';
if (!filePath) {
  console.log('Body  is empty, specify filePath if you want to send data');
} else {
  body = fs.readFileSync(filePath, 'utf8');
}

const options = {
  hostname: 'localhost',
  port: 3000,
  path: path,
  method: method,
  headers: {
    'Content-Type': contentType,
    'Content-Length': body.length,
    Accept: accept,
  },
};

const req = http.request(options, requestCallback);
req.on('error', err => {
  console.log(err);
});
req.write(body);
req.end();

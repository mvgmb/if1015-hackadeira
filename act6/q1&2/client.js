'use strict';

const resultDiv = document.getElementById('result');

const connection = new WebSocket('ws://localhost:8080/testing');

connection.onopen = () => {
  console.log('entered chat!');
};

connection.onclose = () => {
  console.log('connection closed');
};

connection.onmessage = e => {
  const serverMessage = e.data;
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML += `<br>${serverMessage}`;

  console.log(serverMessage);
};

const buttonClick = () => {
  const inputMessage = document.getElementById('inputMessage');
  connection.send(inputMessage.value);

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML += `<br>you:  ${inputMessage.value}`;

  inputMessage.value = '';
};

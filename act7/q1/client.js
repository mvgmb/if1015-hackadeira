'use strict';

const connection = new WebSocket('ws://localhost:8080/requests');

connection.onopen = () => {
  console.log('connected to requests server');
};

connection.onclose = () => {
  console.log('connection closed');
};

let waitingRequest = true;

connection.onmessage = e => {
  const serverMessage = e.data;
  const requestDiv = document.getElementById('request');
  requestDiv.innerHTML = `${serverMessage}`;

  const btn = document.getElementById('button');
  btn.innerHTML = `approve`;

  waitingRequest = false;
};

const buttonClick = () => {
  if (!waitingRequest) {
    const btn = document.getElementById('button');
    btn.innerHTML = `all requests approved! waiting for more requests`;
    waitingRequest = true;

    const requestDiv = document.getElementById('request');
    connection.send(requestDiv.innerHTML);

    const approvedDiv = document.getElementById('approved');
    approvedDiv.innerHTML += `> ${requestDiv.innerHTML}<br>`;
    requestDiv.innerHTML = '';
  }
};

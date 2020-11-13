'use strict';

const connection = new WebSocket('ws://localhost:8080/requests');

connection.onopen = () => {
  console.log('connected to requests server');
};

connection.onclose = () => {
  console.log('connection closed');
};

connection.onmessage = e => {
  const msg = JSON.parse(e.data);
  for (const i in msg.voltages) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `${msg.voltages[i]}V <br> ${contentDiv.innerHTML}`;
  }
};

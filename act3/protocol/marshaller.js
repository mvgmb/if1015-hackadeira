'use strict';

const Marshaller = {
  // Requests
  marshalCalculateRequest: (operation, a, b) => {
    const req = `calculate;${operation};${a};${b}`;
    return Buffer.from(req);
  },

  // Responses
  marshalCalculateResponse: result => {
    const res = `calculate;${result}`;
    return Buffer.from(res);
  },

  marshalError: err => {
    const res = `error;${err}`;
    return Buffer.from(res);
  },
};

module.exports = Marshaller;

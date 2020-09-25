'use strict';

const Unmarshaller = {
  // Requests
  unmarshalRequest: req => {
    if (req.length == 0) throw 'empty request';

    const [type, ...args] = req.toString().split(';');
    switch (type) {
      case 'calculate':
        const [operation, a, b] = args;
        return {
          method: 'calculate',
          args: { operation, a, b },
        };
      default:
        throw 'unsuported request type';
    }
  },

  // Responses
  unmarshalResponse: res => {
    if (res.length == 0) throw 'empty response';

    const [type, ...args] = res.toString().split(';');
    switch (type) {
      case 'error':
        const [err] = args;
        return { err };
      case 'calculate':
        const [result] = args;
        return { result };
      default:
        throw 'unsuported response type';
    }
  },
};

module.exports = Unmarshaller;

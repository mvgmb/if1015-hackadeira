'use strict';

const http = require('http');
const express = require('express');
const xmlparser = require('express-xml-bodyparser');
const convert = require('xml-js');

const lists = require('./lists');

const app = express();
app.use(express.json());
app.use(
  xmlparser({
    explicitArray: false,
    normalize: false,
    normalizeTags: false,
    trim: true,
  })
);

const send = (req, res, data) => {
  res.setHeader('Content-Type', req.headers['accept']);

  switch (req.headers['accept']) {
    case 'text/json':
      res.status(200).json(data);
      break;

    case 'text/xml':
      const options = { compact: true, ignoreComment: true, spaces: 2 };
      res.status(200).send(convert.js2xml({ root: data }, options));
      break;

    default:
      res.status(404).send('Required response format not found');
  }
};

const handleRequest = (req, callback) => {
  switch (req.headers['content-type']) {
    case 'text/json':
      let str = '';
      req.on('data', chunk => (str += chunk));
      req.on('end', () => callback(JSON.parse(str)));
      break;

    case 'text/xml':
      callback(req.body['root']);
      break;

    default:
      callback('');
  }
};

app.get('/lists', (req, res) => {
  send(req, res, lists);
});

app.get('/list/:id', (req, res) => {
  const list = lists.find(list => list.id === req.params.id);
  list ? send(req, res, list) : res.status(404).send();
});

app.get('/list/:id/reminders', (req, res) => {
  const list = lists.find(list => list.id === req.params.id);
  send(req, res, list.reminders);
});

app.get('/list/:id/reminder/:id', (req, res) => {
  const list = lists.find(list => list.id === req.params.id);
  if (list) {
    const reminder = list.reminders.find(
      reminder => reminder.id === req.params.id
    );
    if (reminder) {
      send(req, res, reminder);
      return;
    }
  }

  res.status(404).send();
});

app.post('/list', (req, res) => {
  handleRequest(req, body => {
    const listIds = lists.map(list => list.id);

    const id = '' + listIds.length > 0 ? Math.max.apply(Math, listIds) + 1 : 0;
    const list = {
      id: id,
      name: body.name,
      reminders: body.reminders,
    };

    lists.push(list);
    send(req, res, list);
  });
});

app.post('/list/:id/reminder', (req, res) => {
  handleRequest(req, body => {
    const list = lists.find(list => list.id === req.params.id);
    if (list) {
      const reminders = list.reminders.map(reminder => reminder.id);

      const id =
        '' + reminders.length > 0 ? Math.max.apply(Math, reminders) + 1 : 0;
      const reminder = {
        id: id,
        description: body.description,
        done: false,
      };

      list.reminders.push(reminder);
      send(req, res, reminder);
    } else {
      res.status(404).send();
    }
  });
});

app.put('/list/:id', (req, res) => {
  const list = lists.find(list => {
    return list.id === req.params.id;
  });

  if (list) {
    handleRequest(req, body => {
      const updatedList = {
        id: list.id,
        name: body.name,
        reminders: body.reminders,
      };

      const i = lists.indexOf(list);
      lists.splice(i, 1, updatedList);

      res.sendStatus(204);
    });
  } else {
    res.status(404).send();
  }
});

app.put('/list/:id/reminder/:id', (req, res) => {
  const list = lists.find(list => {
    return list.id === req.params.id;
  });

  if (list) {
    const reminder = list.reminders.find(reminder => {
      return reminder.id === req.params.id;
    });

    if (reminder) {
      handleRequest(req, body => {
        const updatedReminder = {
          id: reminder.id,
          description: body.description,
          done: body.done,
        };

        const i = list.reminders.indexOf(reminder);
        list.reminders.splice(i, 1, updatedReminder);

        res.sendStatus(204);
      });
      return;
    }
  }

  res.status(404).send();
});

app.delete('/list/:id', (req, res) => {
  const list = lists.find(list => {
    return list.id === req.params.id;
  });

  if (list) {
    let i = lists.indexOf(list);
    lists.splice(i, 1);
    res.sendStatus(204);
  } else {
    res.status(404).send();
  }
});

app.delete('/list/:id/reminder/:id', (req, res) => {
  const list = lists.find(list => {
    return list.id === req.params.id;
  });

  if (list) {
    const reminder = list.reminders.find(reminder => {
      return reminder.id === req.params.id;
    });

    if (reminder) {
      const i = list.reminders.indexOf(reminder);
      list.reminders.splice(i, 1);

      res.sendStatus(204);
      return;
    }
  }

  res.status(404).send();
});

const server = http.createServer(app);
server.listen(3000);

console.log('Server listening on port 3000');

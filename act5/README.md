# client server rest api

## how to use

Open two terminals and follow the following steps:

server

```bash
cd server
# install dependencies
yarn install

# start server
yarn start
```

client

```bash
# install dependencies
cd client

# send a request to the server
node client.js GET text/json text/xml /list/1/reminders
```

Client command structure:

```
node client.js method content-type accept path filepath
```

The file should contain the desired body data.

Client command examples:

```
node client.js GET text/json text/xml /lists

node client.js POST text/json text/xml /list/1/reminder ./examples/json/reminder.txt

node client.js PUT text/xml text/json /list/1/reminder/1 ./examples/xml/reminder.txt

node client.js DELETE text/json text/xml /list/1
```

API paths

```
GET
/lists
/list/:id
/list/:id/reminders
/list/:id/reminder/:id

POST
/list
/list/:id/reminder

PUT
/list/:id
/list/:id/reminder/:id

DELETE
/list/:id
/list/:id/reminder/:id
```

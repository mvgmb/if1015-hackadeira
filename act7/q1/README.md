# rabbitmq request queue

## how to use

```bash
# start rabbitmqserver
rabbitmq-server

# install dependencies
yarn install

# start the server
node consumer.js

# send a request to be approved
node producer.js "request message"
```

To approve requests open "./client.html" in a browser.

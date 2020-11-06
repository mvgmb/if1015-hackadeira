# rabbitmq request queue

## how to use

```bash
# install dependencies
yarn install

# start the server
node consumer.js

# send a request to be approved
node producer.js "request message"
```

To approve requests go to "localhost:8080/requests".

# client-server calculator with grpc

Simple calculator implementation using grpc.

## how to use

```bash
# install dependencies
yarn install

# start the server
node server.js

# send a request to the server's calculator, for example
node client.js 15 / 12
```

The client receives, respectively, a value, an operation and another value.

Valid operations: addition (+), subtraction (-); multiplication (\*); division (/); and mod (%).

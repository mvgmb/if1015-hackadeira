# udp and tcp client-server calculator with custom protocol

Simple calculator implementation using tcp, udp and custom protocol.

## how to use

Choose one of the implementations and follow these steps:

```bash
# choose implementation by running either
cd udp
# or
cd tcp

# start the server
node server.js

# send a request to the server's calculator, for example
node client.js 15 / 12
```

The client receives, respectively, a value, an operation and another value.

Valid operations: addition (+), subtraction (-); multiplication (\*); division (/); and mod (%).

# udp and tcp client-server calculator

Simple calculator implementation using tcp and udp.

## how to use

Choose one of the implementations and follow these steps:

```bash
# start the server
node server.js

# send a request to the server's calculator, for example
node client.js 15 / 12
```

The client receives, respectively, a value, an operation and another value.

Valid operations: addition (+), subtraction (-); multiplication (\*); division (/); and mod (%).

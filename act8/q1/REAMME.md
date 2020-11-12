# undesired voltage events

Simple program that reports device voltage feed using a websocket. Each event is filtered by a programm written in RxJS and finally sent to a rabbitmq queue, which is consumed and logged.

## how to use

You'll need 4 terminals

```bash
# terminal 1

rabbitmq-server
```

```bash
# terminal 2

cd websocket
yarn install
node index.js
```

```bash
# terminal 3

cd rxjs
yarn install
node index.js
```

```bash
# terminal 4

cd rabbitmq
yarn install
node index.js
```

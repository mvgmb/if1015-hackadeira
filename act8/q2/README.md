# undesired voltage events

Simple program that reports device voltage feed using a websocket. Each event is filtered by a programm written in RxJS and finally sent to a rabbitmq queue, which is consumed and logged. To see undesired voltages, open **_./web/index.html_** file in browser.

## how to use

You'll need 5 terminals

```bash
# terminal 1

rabbitmq-server
```

```bash
# terminal 2

cd producers/websocket
yarn install
node index.js
```

```bash
# terminal 3

cd producers/grpc
yarn install
node index.js
```

```bash
# terminal 4

cd rxjs
yarn install
node index.js
```

```bash
# terminal 5

cd rabbitmq
yarn install
node index.js
```

# socketiyo

WebSocket-based, bi-directional events in between client and server.

 * WebSocket
 * Events
 * Auto-reconnect
 * Light-weight
 * Modern

## Platforms

 - socketiyo (server): NodeJs
 - socketiyo-client: NodeJs, Web, Deno

## Usage

### Install

#### server side

[`npm i socketiyo`](https://www.npmjs.com/package/socketiyo)

#### client side

[`npm i socketiyo-client`](https://www.npmjs.com/package/socketiyo-client)

### Server


```js
import ws from "ws";
import {
    attachWebSocketServer,
    CONNECT,
    DISCONNECT,
    ERROR,
    DEFAULT_CHANNEL,
} from "socketiyo";
import {
    maxClients,
    highClients,
    lowEnough,
    maxLength,
    maxChannels,
    maxChannelLength,
} from "socketiyo/source/defaultOptions.js";
import {useDefaultLogging} from "socketiyo/source/defaultLogging.js";



// see https://github.com/GrosSacASac/JavaScript-Set-Up/blob/master/js/network/socketiyo/examples/exampleServer.js
// to view example on how to create the variable webSocketServer
const socketiYoServer = attachWebSocketServer({
    webSocketServer
    maxClients,
    highClients,
    lowEnough,
    maxLength,
    maxChannels,
    maxChannelLength,
});

useDefaultLogging({socketiYoServer});

/* send the current time on the default channel to everyone */
setInterval(() => {
    socketiYoServer.sendAll(Date.now());
}, 1500);

socketiYoServer.on(CONNECT, socket => {
    /* send welcome to the socket*/
    socketiYoServer.send(socket, { message: `welcome` });
    /* alert others as well */
    socketiYoServer.sendAllExceptOne(socket, { message: `new connection` });
});

socketiYoServer.on(`game/input`, ({socket, data}) => {
    console.log(`${socket} send us ${data}`);
});
```

### Server APIs

```js
socketiYoServer = attachWebSocketServer({
    webSocketServer,
    highClients,
    maxClients,
    maxLength,
    maxChannels,
    maxChannelLength,
    lowEnough,
    packData = defaultPackData,
    unpackData = defaultUnpackData,
})
```

```js
socketiYoServer.on(eventName, callback)
```

```js
socketiYoServer.off(eventName, callback)
```

```js
socketiYoServer.send(socket, data, channel = DEFAULT_CHANNEL)
```

```js
socketiYoServer.sendAll(data, channel = DEFAULT_CHANNEL)
```

```js
socketiYoServer.sendAllExceptOne(exceptionSocket, data, channel = DEFAULT_CHANNEL)
```


```js
socketiYoServer.close()
```

### Extensions

#### Disconnection detection

By default a TCP connection can stay open for an indefinite amount of time. And WebSockets are built on top of TCP.
If one end of the connection disconnects abruptly it will not properly send the end connection message. The server will not know it disconnected and may keep the connection information in memory. If this happens too much the memory leak may eventually crash the application. The disconnection detection is an extension that will periodically send PING and expect a PONG response, to confirm that the connection that the server has in memory are indeed still alive.

```js
import { useAdditionalDisconnectionDetection } from "socketiyo/extensions/disconnectionDetection.js";


const closeDisconnectionDetection = useAdditionalDisconnectionDetection({ socketiYoServer });
```

The closeDisconnectionDetection is a function that should be called before the websocket server is closed.

### Client

#### Import

##### Node

```js
import {
    createConnection,
    CONNECT,
    DISCONNECT,
    ERROR,
    DEFAULT_CHANNEL,
    reconnectDelay, randomReconnectDelay, autoReconnect,
    useDefaultLogging,
} from "socketiyo-client/source/socketiyo-client.js";
```



##### Deno and Web

**Use the node import if you are using a bundler**

```js
import {
    createConnection,
    CONNECT,
    DISCONNECT,
    RECONNECTING,
    ERROR,
    DEFAULT_CHANNEL,
    reconnectDelay,
    randomReconnectDelay,
    autoReconnect,
    useDefaultLogging,
} from "./node_modules/socketiyo-client/built/socketiyo-client.es.js";
// or } from "https://unpkg.com/socketiyo-client/built/socketiyo-client.es.js";
```


#### usage

```js

const socketiyoConnection = createConnection({
    url: `ws://localhost:8080/socketiyo`,
    reconnectDelay,
    randomReconnectDelay,
    autoReconnect,
});

useDefaultLogging({ socketiyoConnection });

socketiyoConnection.on(DEFAULT_CHANNEL, (x) => {
    console.log(x);
});

socketiyoConnection.on(`game/end`, (x) => {
    console.log(`game/end ${x}`);
});
```

### Client APIs


```js

socketiyoConnection = createConnection({
    url,
    packData = defaultPackData,
    unpackData = defaultUnpackData,
    reconnectDelay,
    randomReconnectDelay,
})
```

```js
socketiyoConnection.on(eventName, callback)
```

```js
socketiyoConnection.off(eventName, callback)
```

```js
socketiyoConnection.send(data, channel = DEFAULT_CHANNEL)
```

```js
socketiyoConnection.close()
```

### About

Concept inspired by socket.io

#### What are the differences between socketiyo and socket.io ?

 * Rooms and events are combined and called channels.
 * Namespaces are handled outside of the library by creating more instances with different options.
 * The WebSocket http server implementation is not provided, instead socketiyo expects a peer dependency to be injected at runtime.
 * The client is not served by default in the server. It has to be explicitly imported in the client code instead.
 * No fallback provided when WebSocket is not available. No background protocol upgrades.
 * Regular events and library events cannot be confused.
 * Does not decorate the sockets with custom methods

#### License

[CC0](./license.txt)

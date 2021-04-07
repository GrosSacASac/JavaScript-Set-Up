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




import { createHttpServer } from "./createHttpServer.js"; // see examples
const socketiYoServer = attachWebSocketServer({
    httpServer,
    ws,
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
    httpServer,
    ws,
    path,
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

### Client

#### Import

##### Node

```js
import {
    createConnection,
    CONNECT,
    DISCONNECT,
    ERROR,
    DEFAULT_CHANNEL
} from "socketiyo-client/source/socketiyo-client.js";
import { reconnectDelay, randomReconnectDelay, autoReconnect } from "socketiyo-client/source/defaultOptions.js";
import { useDefaultLogging } from "socketiyo-client/source/defaultLogging.js";
```

##### Deno and Web


```js
import {
    createConnection,
    CONNECT,
    DISCONNECT,
    ERROR,
    DEFAULT_CHANNEL
} from "https://unpkg.com/socketiyo-client/source/socketiyo-client.js";
import { reconnectDelay, randomReconnectDelay, autoReconnect } from "https://unpkg.com/socketiyo-client/source/defaultOptions.js";
import { useDefaultLogging } from "https://unpkg.com/socketiyo-client/source/defaultLogging.js";
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

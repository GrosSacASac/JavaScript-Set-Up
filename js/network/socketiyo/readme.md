# socketiyo


Concept inspired by socket.io

What are the differences from socketiyo ?

Rooms and events are combined and called channels. These channels are hidden. When a client subscibes to an event, it will be listening on that channel with the same event name, that can only emit this event name.

Namespaces are handled outside of the library by creating more instances with different options.

The WebSocket server implementation is not provided, instead socketiyo expects a peer dependency to be injected at runtime.

The client is not served by default in the server. It has to be explicitly imported in the client code instead.

No fallback provided when WebSocket is not available. No background protocol upgrades.

No disconnection detection on the server yet.

Regular events and library events cannot be confused.

Does not decorate the sockets with custom methods, instead of having a broadcast method on each socket, there is a static send all except one, that takes a socket as first argument.

## Usage

### Install

#### client side

`npm i socketiyo-client`

#### server side

`npm i socketiyo`

### `attachWebSocketServer`

the third argument is optional and could be any object that has at least `error, warn, log, debug`. It could be a winston instance.

```
import {
    attachWebSocketServer,
    CONNECT,
    DISCONNECT,
	ERROR,
	DEFAULT_CHANNEL,
} from "../source/socketiyo.js";
import {
    maxClients, maxLength, maxChannels, maxChannelLength
} from "../source/defaultOptions.js";

/* httpServer, ws are not provided, see examples */
const socketiYoServer = attachWebSocketServer({
    httpServer,
    ws,
    maxClients, maxLength, maxChannels, maxChannelLength
});


/* send the current time on the default channel to everyone */
setInterval(() => {
    socketiYoServer.sendAll(Date.now());
}, 1500);

/* send It is over to anyone on the game/end channel*/
setTimeout(() => {
    socketiYoServer.sendAll(`It is over`, `game/end`);
}, 10000);

socketiYoServer.on(CONNECT, socket => {
    console.log(`${socket} connected`);
    /* send welcome to the socket*/
    socketiYoServer.send(socket, {message: `welcome`});
    /* alert others as well */
    socketiYoServer.sendAllExceptOne(socket, {message: `new connection`});
});

socketiYoServer.on(DISCONNECT, socket => {
    console.log(`${socket} disconnected`);
});

socketiYoServer.on(ERROR, error => {
    console.error(error);
});

socketiYoServer.on(`game/input`, ({socket, data}) => {
    console.log(`${socket} send us ${data}`);
});
```

### License

[CC0](./license.txt)